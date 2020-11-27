import comtypes.client as com
import time


#------------------------------------------------------------------------
#-- Class to start the apll
class RunDIAdem():
    def __init__(self):
        self._oDIAdem_Comand = com.CreateObject('DIAdem.TOCommand')
        while 1:
            if (False == self._oDIAdem_Comand.bInterfaceLocked):
                break   
        print ("DIAdem __init__ gestartet: " )
        #self._oDIAdem_Comand.bDontCloseApplication = True
        
        
    # -- Method to Load a given DataFile with a DataPlugin
    def LoadData(self, sFileNamePath, sDpName):
        iSuccess = self._oDIAdem_Comand.CmdExecuteSync("wndshow('shell','normal')")
        print ("DIAdem wndShow: " + str(iSuccess))
        iSuccess = self._oDIAdem_Comand.CmdExecuteSync("DataDelAll(0)")
        iSuccess = self._oDIAdem_Comand.CmdExecuteSync("DataFileLoad('" + sFileNamePath + "','" + sDpName + ")")
        print ("DIAdem DataFileLoad: " + str(iSuccess))

    def Close(self):
        #self._oDIAdem_Comand.CmdExecuteSync("ProgramExit")
        #self._oDIAdem_Comand.Close()
        print("DIAdem Geschlossen")

#--End Class RunDIAdem
#------------------------------------------------------------------


#------------------------------------------------------
# Start this script like: python D:\python\DIAdem_Start.py --DataPlugin_Name="TDM" --data_file="Example.tdm"
#------------------------------------------------------
def main():
    import optparse
    # get the parameter from argument list or work with some defaults for testing
    parser = optparse.OptionParser()
    parser.add_option("--DataPlugin_Name",
                      help="plugin name",
                      dest="DP_Name", default="Touchstone_Complex")

    parser.add_option("--data_file",
                      help="Data file to load with the DataPlugin",
                      dest="DataFileName", default="d:\\python\\monopole_2port_Z_MA.s2p")

    #------------------------------------------------------
    (opts, args) = parser.parse_args()
    print ("----- Start to Load Data with \""+ opts.DP_Name +"\" DataPlugin and the file \""+opts.DataFileName +"\"--------")

    #------------------------------------------------------
    dd = RunDIAdem()
    dd.LoadData(opts.DataFileName, opts.DP_Name )
    time.sleep(5)
    dd.Close()
    #
    #------------------------------------------------------



if (__name__ == "__main__"):
    main()

