import unittest
import sys
from npy_read_numpy_array_dump import Plugin


class BasicDataPluginTests(unittest.TestCase):

    def test_class_init(self):
        p = Plugin()
        self.assertIsInstance(p, Plugin)


if __name__ == '__main__':
    unittest.main()
