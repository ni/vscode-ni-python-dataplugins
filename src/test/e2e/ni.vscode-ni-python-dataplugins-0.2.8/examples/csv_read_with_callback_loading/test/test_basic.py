import unittest
import sys


class BasicDataPluginTests(unittest.TestCase):

    def test_class_init(self):
       p = Plugin()
       assert(True)


if __name__ == '__main__':
    sys.path.append('.')
    from csv_read_with_callback_loading import Plugin
    
    unittest.main()
