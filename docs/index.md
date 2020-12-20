- [Python DataPlugins](#python-dataplugins)
  * [Get Started](#get-started)
    + [Plugin class](#plugin-class)
    + [Store read](#store-read)
  * [Export](#export)
  * [Known Limitations](#known-limitations)

# Python DataPlugins

Create a DataPlugin to load, to register, or to search your own file formats in LabVIEW or DIAdem, or to index and to browse your own file formats with DataFinder.

DataPlugins can be created by using C++, VBS, LabVIEW or Python.

## Get Started

Python DataPlugins consist of only one python file that contains all the logic. Almost all language features of the official Python 3.5.4 and its base libraries can be used.

### Plugin class

Start writing your DataPlugin by implementing the
```python 
class Plugin:
```
The class name cannot be changed.

### Store read

Every Python DataPlugins needs to implement a read_store method.
```python
def read_store(self, parameter):
   """
   Read data file and return a python dictionary
      that contains groups and channels
         in a TDM-like structure.
   """
```
This method is called by DIAdem, LabVIEW or DataFinder when it attempts to open your data file. The applications pass a set of useful parameters that can be accessed in the array "parameter".
```python 
parameter['file'] # String: Contains the absolute path to the data file
parameter['datafinder'] # Boolean: Denotes if data file was accessed by DataFinder and the bulk data was not touched.
```
Use the file parameter to access your file using text, csv or binary readers. The data has to be filled into a python dictionary.
```python 
tdm_model = {}
```


## Export
Export Python DataPlugins to make them available on other systems. Use DIAdem to export a DataPlugin as a URI file.

## Known Limitations
<details>
  <summary>Numpy and Pandas</summary>
  <p>Unfortunately, Numpy and Pandas are not well supported to run in embedded Python and, therefore, cannot be used in DataPlugins.</p>
</details>

<details>
  <summary>datetime.strptime</summary>
  <p>Unfortunately, Numpy and Pandas are not well supported to run in embedded Python and, therefore, cannot be used in DataPlugins.</p>
</details>