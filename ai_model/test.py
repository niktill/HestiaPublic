## import modules ## 
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import datetime
from time import sleep
import os
import sys

#from keras.models import load_model
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

print(os.listdir("CLASSIFIER"))
model_path = 'CLASSIFIER/CNN_ep5_1.h5'
model = load_model(model_path)

