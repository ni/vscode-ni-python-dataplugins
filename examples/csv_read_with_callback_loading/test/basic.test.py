import unittest
import sys
import csv_read_with_callback_loading


class BasicDataPluginTests(unittest.TestCase):

    def test_class_init(self):
       p = Plugin()
       assert(True)


if __name__ == '__main__':
    sys.path.append('..')
    
    unittest.main()
