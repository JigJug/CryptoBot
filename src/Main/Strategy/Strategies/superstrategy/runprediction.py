import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras.models import Sequential
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.layers import Dense, LSTM, Dropout

def loadData(csv):
    df = pd.read_csv(csv, delimiter=' ')
    print(df.columns)
    data = df['close'].values.reshape(-1, 1)  # Assuming 'close' is the column you want to predict
    scaler = MinMaxScaler()
    scaled_data = scaler.fit_transform(data)
    return scaled_data, scaler

def create_sequences(data, sequence_length):
    X, y = [], []
    for i in range(len(data) - sequence_length):
        X.append(data[i:i+sequence_length])
        y.append(data[i+sequence_length])
    return np.array(X), np.array(y)

model = tf.keras.models.load_model("1dcandles.keras")

# Load and preprocess data
scaled_data_ftm, scaler_ftm = loadData('SOLUSDT300.json.csv')

sequence_length = 30
X_ftm_test, y_ftm_test = create_sequences(scaled_data_ftm, sequence_length)

# Evaluate the model
predictions = model.predict(X_ftm_test)
predictions = scaler_ftm.inverse_transform(predictions)
y_ftm_test = scaler_ftm.inverse_transform(y_ftm_test)

#####################################
#BUYING AND SELLING 

# Calculate the percentage change in price
percentage_change = (y_ftm_test[1:] - y_ftm_test[:-1]) / y_ftm_test[:-1] * 100

# Define a threshold for decision-making
threshold = 0.6  # You may adjust this threshold based on your preferences and the characteristics of your data

# Create a list to store trading decisions
decisions = []

# Make trading decisions based on predictions and percentage change
for i in range(0, len(predictions)):
    predicted_change = (predictions[i] - predictions[i-1]) / predictions[i-1] * 100

    if predicted_change > threshold:
        decisions.append('Buy')
    elif predicted_change < -threshold:
        decisions.append('Sell')    
    else:
        decisions.append('wait')

# Print the trading decisions
for i, decision in enumerate(decisions):
    print(f"Prediction: {predictions[i][0]:.2f}, Actual: {y_ftm_test[i][0]:.2f}, Decision: {decision}")
