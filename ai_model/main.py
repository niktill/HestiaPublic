"""
This module executes the entire proramm.
It connects to MongoDB. It calls functions to compute max acceleration and number of impacts and calculates the impact limit.
In case of detected overtraining with an impact limit, it sends out an email.
"""

__author__ = "Hestia"
__email__ = "fab.ulmer@gmail.com"

## import modules ## 
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import datetime
from time import sleep
import os
import sys

from tensorflow.keras.models import load_model
from keras.preprocessing import image

import pymongo
from pymongo import MongoClient
#import dns
from bson.objectid import ObjectId

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

import pprint
import io

import functions
import AI_functions

# set developer variables
DEBUG = False
Enable_AI = True


def main():
    ## connect to MongoDB ## 
    # connect to client
    connection_url = SG_API_KEY = os.getenv('MONGO_URI')
    try:
        client = pymongo.MongoClient(connection_url)
        #print("databases", client.list_database_names())
        print("Connection to MongoDB established.\n")
    except Exception as e:
        print(f"Failed to connect to MongoDB.\nError: {e}")
        sys.exit()


    # get database 'hestia-prod'
    db = client.get_database('hestia-prod')  # <class 'pymongo.database.Database'>
    collections_existing = db.list_collection_names()
    #print("existing collections", collections_existing)

    # collection aka Table; created lazily
    col_imuentries = db['imuentries']  # <class 'pymongo.collection.Collection'>
    col_athletes = db['athletes']
    col_users = db['users']


    ## loop over all unproccesed imu entries ##
    no_IMU_found_flag = False
    while True:
        ## get an unproccesed imu entry, i.e. the first ##
        cur_imu = col_imuentries.find_one({"processed": False})

        # if all imu entries are procceses
        if cur_imu is None:
            
            if no_IMU_found_flag == False:
                print("All IMU entries have been processed. Search again every 10 seconds...")
            no_IMU_found_flag = True
            
            
            sleep(10)
            continue
        
        # if unprocces IMU entries exist   
        else:
            no_IMU_found_flag = False
            val_imu_id = cur_imu['_id']
            print(f"Unprocessed IMU with ID {val_imu_id} has been found at {datetime.datetime.now()}, processing now...")
             
            val_imu_athleteObjectId = cur_imu['athleteObjectId']
            val_imu_uploadDate = cur_imu['uploadDate']

            ## get max acceleration of athlete in one IMU file ##
            # (get harmonic mean between max acceleration and speed) 
            cur_csv = cur_imu['csv']
            max_acc_norm, max_harmonic_mean = functions.get_max_performance(cur_csv)
            # round up to two decimal numbers
            max_acc_norm = round(max_acc_norm, 2)

            ## get number of tackles of athelte via AI model in one IMU file ##
            model_path = 'CLASSIFIER/CNN_ep5_1.h5'
            src_path = 'SOURCE/Player/'
            if Enable_AI == True: 
                tackle, no_tackle = AI_functions.classify(cur_csv ,model_path, src_path)
            else:
                tackle = 27

            game_date = datetime.datetime.now()

            ## update imu collection and upload to MongoDB ##
            query = { "_id": val_imu_id }  # val_imu_id
            if DEBUG:
                #print("! Debug is on !")
                new_values = { "$set": { "maxAcceleration": max_acc_norm, "impacts": tackle } }
            else:
                new_values = { "$set": { "maxAcceleration": max_acc_norm, "impacts": tackle, "date": game_date, "processed": True } }
            
            col_imuentries.update_one(query, new_values)
            
            
            ## get impact limit of athlete ##
            col_imuentries = db['imuentries']
            col_athletes = db['athletes']
            col_users = db['users']

            # get athlete cursor connected to processed IMU file
            cur_athletes = col_athletes.find_one({"_id": val_imu_athleteObjectId})
            val_athletes_id = cur_athletes["_id"]

            try:
                val_athletes_impactLimitCalculationDate = cur_athletes['impactLimitCalculationDate']
            except:
                val_athletes_impactLimitCalculationDate = datetime.datetime(1970, 1, 1, 0, 0)

            if (val_athletes_impactLimitCalculationDate < val_imu_uploadDate):
                
                # sort with newest match as first element
                curs_imu_sameplayer = list(col_imuentries.find({"athleteObjectId": val_athletes_id}).sort("date", -1))

                #print(curs_imu_sameplayer)
                                
                if len(curs_imu_sameplayer) >= 3:
                    # case 1
                    curs_imu_sameplayer
                    maxAccleration = [curs_imu_sameplayer[i]["maxAcceleration"] for i in (0, 1, 2)]
                    if np.all(np.diff(maxAccleration) > 0):  # check if max acceleration is decreased 3 times in a row            
                        print("case 1 detected: update athlete's impact limit")
                        query = { "_id": val_athletes_id }
                        new_values = { "$set": { "impactLimit": curs_imu_sameplayer[2]["impacts"], "impactLimitCalculationDate": curs_imu_sameplayer[0]["date"] } }
                        col_athletes.update_one(query, new_values)
                        
                if len(curs_imu_sameplayer) >= 2:
                    # case 2
                    if curs_imu_sameplayer[1]["maxAcceleration"] * 0.65 >= curs_imu_sameplayer[0]["maxAcceleration"]:
                        print("case 2 detected: update athlete's impact limit")
                        query = { "_id": val_athletes_id }
                        new_values = { "$set": { "impactLimit": curs_imu_sameplayer[1]["impacts"], "impactLimitCalculationDate": curs_imu_sameplayer[0]["date"] } }
                        col_athletes.update_one(query, new_values)
                
                    


            ## SendGrid ##
            # Set API Key in CLI session: setx SENDGRID_API_KEY "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"
            # get user cursor connection to athlete
            cur_users = col_users.find_one({"_id": cur_athletes["userObjectId"]})


            if hasattr(cur_athletes, "impactLimit"):
                if (cur_users["emailNotifications"]) and tackle >= cur_athletes["impactLimit"]:
                    #os.system("setx SENDGRID_API_KEY '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'")

                    message = Mail(
                        from_email = 'nik.till@mail.utoronto.ca',
                        to_emails = cur_users["email"])
                               
                    message.dynamic_template_data = {
                                'athleteName': cur_athletes["name"],
                                'date': game_date.strftime('%d/%m/%Y, %H:%M:%S %Z'),
                                'impactLimit': cur_athletes["impactLimit"],
                                'impactNum': tackle,
                              }
                    #message.template_id = 'd-d83e3e68d62745d9999a5cc6dfe03382'
                    message.template_id = 'd-b000db7156264960bee68eba42cc29e4'

                    try:
                        SG_API_KEY = os.getenv('SG_API_KEY')
                        sg = SendGridAPIClient(SG_API_KEY)
                        response = sg.send(message)
                        print("\tAthletes number of tackles is above his impact limit! Email to user is sent.")
                        #print(response.status_code)
                        #print(response.body)
                        #print(response.headers)
                    except Exception as e:
                        print("The following error occured trying to send the email:", str(e))
                    
            print(f"IMU with ID {val_imu_id} has been processed.")
            print(f"\tIMU date: {game_date.strftime('%d/%m/%Y, %H:%M:%S %Z')}")
            print(f"\tNumber of tackles: {tackle}")
            print(f"\tMax acceleration: {max_acc_norm}")
            print("\n")


if __name__ == "__main__":
    main()

