"""
This module contains all non-AI function, that is functions that
use Data Analytics techniques
"""

from tensorflow.keras.models import load_model
#from keras.models import load_model  # for keras so-called saved model
from keras.preprocessing import image  # for keras .h5 model 
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import io
import os



def classify(str_csv, model_path, source_path):

  df = pd.read_csv(io.StringIO(str_csv), sep=',')

  # compute acc norm
  df["Accelnorm"] = np.sqrt(np.square(df[['AccelX','AccelY','AccelZ']]).sum(axis=1))

  # frame number  
  HEAD = 4800
  
  # dimensions of images
  img_width, img_height = 1152, 648

  # counters
  counter_tackle = 0
  counter_no_tackle = 0

  # load the trained model
  model = load_model(model_path)

  for ii in range(0,HEAD,100):
    
    x = df["FrameID"][ii:ii+100]
    y5 = df["Accelnorm"][ii:ii+100]

    plt.figure(figsize=(16,9))

    plt.ylim([0, 12.5])

    plt.tick_params(
    axis='both', 
    which='both', 
    bottom=False,
    top=False, 
    labelbottom=False,
    left=False,
    labelleft=False)

    plt.plot(x, y5, "-b", label="Accelnorm")

    plt.savefig(f"SOURCE/Player/f{ii}.png")
    plt.close()

  images = os.listdir(f"SOURCE/Player")

  img_test = []
  for i in images:
      img = image.load_img(f"SOURCE/Player/{i}", target_size=(img_width, img_height))
      img = image.img_to_array(img)
      img_test.append(img)
      img = np.expand_dims(img, axis=0)
      img /= 255.
      # predict_classes is depracated
      #category = model.predict_classes(img, batch_size=10)
      score = model.predict(img)
      category = (score > 0.5).astype("int32")
      category = int(category)
      if category == 1:
        counter_tackle += 1
      else:
        counter_no_tackle += 1  
      
      os.remove(f"SOURCE/Player/{i}")

  return counter_tackle, counter_no_tackle



