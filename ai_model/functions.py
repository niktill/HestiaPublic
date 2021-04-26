"""
This module contains all non-AI function, that is functions that
use Data Analytics techniques
"""

import pandas as pd
import numpy as np
import io
import os

import pymongo
from pymongo import MongoClient
#import dns



def get_max_performance(str_csv):
    """
    Compute a max performance of an athlete in a given IMU game.
    
    Args:
        str_csv (str): IMU file collected from MongoDB

    Returns:
        max_acc_norm: norm of all three acceleration axis
        max_harmonic_mean: the harmonic mean between max_acc_norm and speed
    """

    df = pd.read_csv(io.StringIO(str_csv), sep=',')

    # compute acc norm, and harmonic mean between acc and speed
    df["Accelnorm"] = np.sqrt(np.square(df[['AccelX','AccelY','AccelZ']]).sum(axis=1))
    df["HarmonicMean_Acc_Speed"] = (2*df['Accelnorm']*df['Speed']) / (df['Accelnorm'] + df['Speed'])

    max_acc_norm = df["Accelnorm"].max()
    max_harmonic_mean = df["HarmonicMean_Acc_Speed"].max()

    return max_acc_norm, max_harmonic_mean





