import csv
import os
import sys


class Plugin:

    channel_length = 4
    tdm_model = {}

    def read_store(self, parameter):
        file_path = os.path.realpath(parameter['file'])

        self.tdm_model['HelloWorld'] = {
            "author": "National Instruments",
            "description": file_path
        }
        self.tdm_model['HelloWorld']['groups'] = []

        group = {
            "name": "TheFirstGroup",
            "description": "The first group",
            "channels": [{
                "name": "TheFirstChannel",
                "description": "The first channel",
                "values": [1.0, 1.2, 1.4, 1.6],
                "type": "DataTypeChnFloat64"
            }]
        }

        self.tdm_model['Example']['groups'].extend([group])
        return self.tdm_model

if __name__ == "__main__":
    print("For testing your plugin first, you can run that python file directly from command line")
    p = Plugin()
    parameter = {
        "file": "C:\\Users\\Public\\Documents\\National Instruments\\DIAdem 2020\\Data\\Example.csv"
    }
    print("\n %s" % p.read_store(parameter))
