import csv
import datetime
import os
import sys


class Plugin:

    channel_length = 0
    channelNames = []
    data = []
    tdm_model = {}
    reader = None

    def read_store(self, parameter):
        file_path = os.path.realpath(parameter['file'])

        with open(file_path, newline='') as csvfile:
            tab_delimiter = '\t'
            reader = csv.DictReader(csvfile, delimiter=tab_delimiter)
            self.data = list(reader)
            self.channelNames = reader.fieldnames
            self.channel_length = len(self.data)

        values = {}

        for row in self.data:
            for col_name in self.channelNames:
                value = row[col_name]
                try:
                    value = float(value) if value != "" else None
                except:
                    pass
                if col_name not in values:
                    values[col_name] = []
                values[col_name].append(value)

        self.tdm_model['Example'] = {
            "author": "National Instruments",
            "description": "Example file"}
        self.tdm_model['Example']['groups'] = []

        ###
        # possible data types:
        # DataTypeChnFloat32, DataTypeChnFloat64, DataTypeChnString, DataTypeChnDate, DataTypeChnUInt8, DataTypeChnInt16, DataTypeChnInt32, DataTypeChnInt64
        ###

        group1 = {
            "name": "Example",
            "description": "The first group",
            "time": datetime.datetime(2020, 2, 11, 15, 31, 59, 342380),
            "channels": [{
                "name": self.channelNames[0],
                "description": "",
                "values": values[self.channelNames[0]],
                "info": "Time in seconds",
                "type": "DataTypeChnFloat64"
            }, {
                "name": self.channelNames[1],
                "description": "",
                "values": values[self.channelNames[1]],
                "unit_string": "km/h",
                "type": "DataTypeChnFloat64"
            }, {
                "name": self.channelNames[2],
                "description": "",
                "values": values[self.channelNames[2]],
                "type": "DataTypeChnFloat64"
            }, {
                "name": self.channelNames[3],
                "description": "",
                "values": values[self.channelNames[3]],
                "type": "DataTypeChnFloat64"
            }, {
                "name": self.channelNames[4],
                "description": "",
                "values": values[self.channelNames[4]],
                "type": "DataTypeChnFloat64"
            }, {
                "name": self.channelNames[5],
                "description": "",
                "values": values[self.channelNames[5]],
                "type": "DataTypeChnString"
            }]
        }

        self.tdm_model['Example']['groups'].extend([group1])
        return self.tdm_model

if __name__ == "__main__":
    print("For testing your plugin first, you can run that python file directly from command line")
    p = Plugin()
    parameter = {
        "file": "C:\\Users\\Public\\Documents\\National Instruments\\DIAdem 2020\\Data\\Example.csv"
    }
    print("\n %s" % p.read_store(parameter))
