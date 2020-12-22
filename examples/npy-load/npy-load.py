import os
import re
from pathlib import Path


class Plugin:

    tdm_model = {}

    def read_store(self, parameter):
        file_path = os.path.realpath(parameter["file"])

        f = open(file_path, "r")
        self.load_npy_file(f)

        tdm_tree = {
            "author": "HelloWorkd test",
            "description": "File containing a json dict read by python plugin",
            "groups": [{
                "name": "Group_1",
                "description": "The first group",
                "channels": [{
                    "name": "Index",
                    "description": "",
                    "info": "Going up",
                    "unit_string": "s",
                    "type": "DataTypeChnFloat64",
                    "values": [1, 2, 3]
                }, {
                    "name": "Vals_1",
                    "description": "",
                    "unit_string": "km/h",
                    "type": "DataTypeChnFloat64",
                    "values": [1.1, 2.1, 3.1]
                }, {
                    "name": "Vals_2",
                    "description": "",
                    "unit_string": "km/h",
                    "type": "DataTypeChnFloat64",
                    "values": [1.2, 2.2, 3.2]
                }, {
                    "name": "Str_1",
                    "description": "",
                    "type": "DataTypeChnString",
                    "values": ["abc", "def", "hij"]
                }]
            }, {
                "name": "Group_2",
                "description": "The first group",
                "channels": [{
                    "name": "Index",
                    "description": "",
                    "info": "Going up",
                    "unit_string": "s",
                    "type": "DataTypeChnFloat64",
                    "values": [1, 2, 3, 4]
                }
                ]
            }]
        }

        return {Path(file_path).stem: tdm_tree}

    def load_npy_file(self, file):
        print(file)
        header = self.__read_npy_header(file)
        print(header)

    def __read_npy_header(self, file):
        datafile = file.readlines()

        fortran_order = False
        little_endian = False
        shape = None

        for line in datafile:

            loc_1 = line.find('fortran_order')
            loc_2 = line.find('descr')
            loc_3 = line.find('shape')

            # fortran order
            if loc_1 > -1:
                fortran_order = True if line[loc_1 +
                                             16:loc_1+20] == 'True' else False

            # descr
            if loc_2 > -1:
                endian_char = line[loc_2+9:loc_2+10]
                little_endian = True if (
                    endian_char == '<' or endian_char == '|') else False

            # shape
            if loc_3 > -1:
                start_loc = line.find('(')
                end_loc = line.find(')')

                # finding first shape value
                sub_str_1 = line[start_loc+1:end_loc]
                match_1 = re.search("[0-9][0-9]*", sub_str_1)

                # span tuple: start and end position of match
                number_of_digits = match_1.span()[1] - match_1.span()[0]

                # there must be a second match
                sub_str_2 = line[start_loc+1+number_of_digits:end_loc]
                match_2 = re.search("[0-9][0-9]*", sub_str_2)

                shape = (int(match_1.group()), int(match_2.group()))

        header = {
            'fortran_order': fortran_order,
            'little_endian': little_endian,
            'shape': shape
        }

        return header


if __name__ == "__main__":
    print("For testing your plugin first, you can run that python file directly from command line")
    p = Plugin()
    parameter = {
        "file": "C:\\tmp\\data.npy"
    }
    print("\n %s" % p.read_store(parameter))
