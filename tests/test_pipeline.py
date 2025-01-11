import unittest
import sys
sys.path.append('..')
from pipelines.armms import *

class TestPipeline(unittest.TestCase):
    def setUp(self):
        self.pipeline = Pipeline()

    def tearDown(self):
        pass

    async def test_inlet(self):
        body = await self.pipeline.inlet({}, {"username": "tester"})

        self.assertIn("username", body)

