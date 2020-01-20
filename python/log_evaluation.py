from numpy import genfromtxt
import numpy as np
import matplotlib.pyplot as plt
import sys


filepath = 'dummy.csv'

if len(sys.argv) >= 2: 
    filepath = sys.argv[1]

print(filepath)

log_data = genfromtxt(filepath,
                        delimiter=',',
                        skip_header=1,
                        converters = {
                            1: lambda s: int(s or 0), # tracked persons
                            2: lambda s: int(s or 0), # players
                            3: lambda s: 'true' in str(s), # lane 1
                            8: lambda s: 'true' in str(s), # lane 2
                            13: lambda s: 'true' in str(s), # lane 3
                            18: lambda s: 'true' in str(s), # lane 4
                        })

def calc_dates(data):
    dates = list()
    for entry in data:
        dates.append(entry[0])
    return np.array(dates)

dates = (calc_dates(log_data) - log_data[0][0]) / 1000 / 60
person_delta = list(map(lambda x: x[1] - x[2], log_data))

def calc_out_of_bound(entry):
    value = 0
    coordinates = list([entry[4], entry[5], entry[6], entry[7],
                       entry[9], entry[10], entry[11], entry[12],
                       entry[14], entry[15], entry[16], entry[17],
                       entry[19], entry[20], entry[21], entry[22]])

    for coordinate in coordinates:
        if coordinate > 1:
            value += coordinate - 1
        if coordinate < 0:
            value += abs(coordinate)

    return value

def calc_lane_time(data):
    lane_count = np.array([0, 0, 0, 0])
    last_time = data[0][0]
    for entry in data:
        if entry[3]:
            lane_count[0] += entry[0] - last_time
        if entry[8]:
            lane_count[1] += entry[0] - last_time
        if entry[13]:
            lane_count[2] += entry[0] - last_time
        if entry[18]:
            lane_count[3] += entry[0] - last_time
        last_time = entry[0]

    return lane_count / 1000

def calc_player_count(data):
    playing = list()
    for entry in data:
        players = 0
        if entry[3]:
            players += 1
        if entry[8]:
            players += 1
        if entry[13]:
            players += 1
        if entry[18]:
            players += 1
        playing.append(players)
    return np.array(playing)


lanes = ["Drums", "Bass", "Melody", "Tone"]
print(calc_lane_time(log_data))

out_of_range = list(map(calc_out_of_bound, log_data))

plt.subplots_adjust(wspace=None, hspace=0.5)

plt.subplot(2,2,1)
plt.plot(dates, out_of_range)
plt.xlabel('time (min)')
plt.ylabel('difference')
plt.title("Hands out of Lane")
plt.legend()

plt.subplot(2,2,2)
plt.step(dates, person_delta)
plt.xlabel('time (min)')
plt.ylabel('tracked but not playing')
plt.yticks(np.arange(min(person_delta), max(person_delta)+1, 1.0))
plt.title("Player Tracking")
plt.legend()

plt.subplot(2,2,3)
plt.bar(lanes, calc_lane_time(log_data))
plt.xlabel('lane')
plt.ylabel('time (s)')
plt.title("Time in Lane")
plt.legend()

plt.subplot(2,2,4)
plt.step(dates, calc_player_count(log_data),label='player count')
plt.plot(dates, np.ones(len(dates)) * calc_player_count(log_data).mean(), label='mean')
plt.xlabel('time (min)')
plt.ylabel('players')
plt.title("Player Count")
plt.legend()

plt.show()