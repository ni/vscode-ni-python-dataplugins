import comtypes.client as com_client
import os
import time


class RunDIAdem():
    def __init__(self):
        try:
            self._oDIAdem_Comand = com_client.CreateObject('DIAdem.TOCommand')
        except WindowsError:
            print("> DIAdem not installed on the system.")
            os._exit(1)
        while 1:
            if (False == self._oDIAdem_Comand.bInterfaceLocked):
                break
        print("DIAdem __init__ started: ")

    # -- Method to Load a given DataFile with a DataPlugin
    def LoadData(self, sFileNamePath, sDpName):
        iSuccess = self._oDIAdem_Comand.CmdExecuteSync(
            "wndshow('shell','normal')")
        print("DIAdem wndShow: " + str(iSuccess))
        iSuccess = self._oDIAdem_Comand.CmdExecuteSync("DataDelAll(0)")
        iSuccess = self._oDIAdem_Comand.CmdExecuteSync(
            "DataFileLoad('" + sFileNamePath + "','" + sDpName + ")")
        print("DIAdem DataFileLoad: " + str(iSuccess))

    def Close(self):
        print("DIAdem closed")

# ------------------------------------------------------------------


# ------------------------------------------------------
# Start this script like: python diadem_load.py --DataPlugin_Name="CSV" --data_file="Example.csv"
# ------------------------------------------------------
def main():
    import optparse
    # get the parameter from argument list or work with some defaults for testing
    parser = optparse.OptionParser()
    parser.add_option("--DataPlugin_Name",
                      help="DataPlugin name",
                      dest="DP_Name")

    parser.add_option("--data_file",
                      help="Data file to load with the DataPlugin",
                      dest="DataFileName")

    # ------------------------------------------------------
    (opts, args) = parser.parse_args()

    if opts.DP_Name == None or opts.DataFileName == None:
        parser.print_help()
        return

    print("----- Start to Load Data with \"" + opts.DP_Name +
          "\" DataPlugin and the file \"" + opts.DataFileName + "\"--------")

    # ------------------------------------------------------
    dd = RunDIAdem()
    dd.LoadData(opts.DataFileName, opts.DP_Name)
    time.sleep(5)
    dd.Close()
    #
    # ------------------------------------------------------


if (__name__ == "__main__"):
    main()
