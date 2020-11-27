import csv
import os
import sys


class Plugin:

    channelNames = []
    data = []
    tdm_model = {}

    def read_store(self, parameter):
        file_path = os.path.realpath(parameter['file'])

        with open(file_path, newline='') as csvfile:
            tab_delimiter = '\t'
            reader = csv.DictReader(csvfile, delimiter=tab_delimiter)
            self.data = list(reader)
            self.channelNames = reader.fieldnames

        self.tdm_model['Example'] = {
            "description": "Example file"}
        self.tdm_model['Example']['groups'] = []

        ###
        # possible data types:
        # DataTypeChnFloat32, DataTypeChnString, DataTypeChnDate, DataTypeChnUInt8, DataTypeChnInt16, DataTypeChnInt32, DataTypeChnInt64
        ###

        group1 = {
            "name": "Example",
            "description": "The first group",
            "author": "National Instruments",
            "channels": [{
                "name": self.channelNames[0],
                "description": "",
                "values": [],
                "info": "Time in seconds",
                "type": "DataTypeChnFloat64"
            }, {
                "name": self.channelNames[1],
                "description": "",
                "values": [],
                "unit_string": "km/h",
                "type": "DataTypeChnFloat64"
            }, {
                "name": self.channelNames[2],
                "description": "",
                "values": [],
                "type": "DataTypeChnFloat64"
            }, {
                "name": self.channelNames[3],
                "description": "",
                "values": [],
                "type": "DataTypeChnFloat64"
            }, {
                "name": self.channelNames[4],
                "description": "",
                "values": [],
                "type": "DataTypeChnFloat64"
            }, {
                "name": self.channelNames[5],
                "description": "",
                "values": [],
                "type": "DataTypeChnString"
            }]
        }

        self.tdm_model['Example']['groups'].extend([group1])
        return self.tdm_model

    def read_channel_length(self, grp_index, chn_index):
        return len(self.data)

    def read_channel_values(self, grp_index, chn_index, numberToSkip, numberToTake):
        dataType = self.tdm_model['Example']['groups'][grp_index]['channels'][chn_index]['type']
        values = []
        for row in self.data:
            value = row[self.channelNames[chn_index]]
            if value != "":
                if dataType == "DataTypeChnFloat64":
                    value = float(row[self.channelNames[chn_index]])
            else:
                value = None
            values.append(value)
        return values[numberToSkip:numberToTake+numberToSkip]


if __name__ == "__main__":
    print("For testing your plugin first, you can run that python file directly from command line")
    p = Plugin()
    parameter = {
        "file": "C:\\Users\\Public\\Documents\\National Instruments\\DIAdem 2020\\Data\\Example.csv"
    }
    print("\n %s" % p.read_store(parameter))
    print("\nChannel length: %s" % p.read_channel_length(0, 0))
    print("\nChannel values: %s" % p.read_channel_values(0, 0, 0, 1024))
