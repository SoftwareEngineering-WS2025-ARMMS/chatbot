import unittest
import asyncio
from src.webui_pipeline.pipelines.armms import *

class TestPipeline(unittest.TestCase):
    def setUp(self):
        self.pipeline = Pipeline()
        asyncio.run(self.pipeline.on_startup())

    def tearDown(self):
        asyncio.run(self.pipeline.on_shutdown())

    def test_inlet(self):
        """
        Tests the pipeline inlet

        The inlet is responsible for providing the additional information it gets about the user
        to the returned body

        This will be then later used by the pipe
        """
        body = asyncio.run(self.pipeline.inlet({'messages': [{'role': 'user', 'content': 'Hallo, wie kannst du mir unterstützen'}, {'role': 'assistant', 'content': 'Hallo, ich freue mich, dich bei deiner heutigen Tätigkeit im Verein zu unterstützen. Wie kann ich dir helfen?'}, {'role': 'user', 'content': 'Wann war das letzte Meeting?'}, {'role': 'assistant', 'content': 'Hallo, ich freue mich, dich bei deiner heutigen Tätigkeit im Verein zu unterstützen. Wie kann ich dir helfen?'}, {'role': 'user', 'content': 'Wann war das letzte Meeting'}]},
                                                {"oauth_sub": "12345"}))

        self.assertIn("oauth_sub", body["user_additional_info"])
    
    def test_pipe_no_user(self):
        answer = self.pipeline.pipe("Hello", "-", "-", {'messages': [{'role': 'user', 'content': 'Hallo, wie kannst du mir unterstützen'}, {'role': 'assistant', 'content': 'Hallo, ich freue mich, dich bei deiner heutigen Tätigkeit im Verein zu unterstützen. Wie kann ich dir helfen?'}, {'role': 'user', 'content': 'Wann war das letzte Meeting?'}, {'role': 'assistant', 'content': 'Hallo, ich freue mich, dich bei deiner heutigen Tätigkeit im Verein zu unterstützen. Wie kann ich dir helfen?'}, {'role': 'user', 'content': 'Wann war das letzte Meeting'}]})
        
        self.assertIn("Error", answer)
    
    def test_pipe_malformed_sub(self):

        body = asyncio.run(self.pipeline.inlet({'messages': [{'role': 'user', 'content': 'Hallo, wie kannst du mir unterstützen'}, {'role': 'assistant', 'content': 'Hallo, ich freue mich, dich bei deiner heutigen Tätigkeit im Verein zu unterstützen. Wie kann ich dir helfen?'}, {'role': 'user', 'content': 'Wann war das letzte Meeting?'}, {'role': 'assistant', 'content': 'Hallo, ich freue mich, dich bei deiner heutigen Tätigkeit im Verein zu unterstützen. Wie kann ich dir helfen?'}, {'role': 'user', 'content': 'Wann war das letzte Meeting'}]},
                                                {"oauth_sub": "12345"}))
        answer = self.pipeline.pipe("Hello", "-", "-", body)
        
        self.assertIn("Error", answer)
    
    def test_pipe_invalid_user(self):
        body = asyncio.run(self.pipeline.inlet({'messages': [{'role': 'user', 'content': 'Hallo, wie kannst du mir unterstützen'}, {'role': 'assistant', 'content': 'Hallo, ich freue mich, dich bei deiner heutigen Tätigkeit im Verein zu unterstützen. Wie kann ich dir helfen?'}, {'role': 'user', 'content': 'Wann war das letzte Meeting?'}, {'role': 'assistant', 'content': 'Hallo, ich freue mich, dich bei deiner heutigen Tätigkeit im Verein zu unterstützen. Wie kann ich dir helfen?'}, {'role': 'user', 'content': 'Wann war das letzte Meeting'}]},
                                               {"oauth_sub": "oidc@123"}))
        answer = self.pipeline.pipe("Hello", "-", "-", body)
        
        self.assertIn("Error", answer)
    

    def test_pipe_valid_user_connected_to_storage(self):
        body = asyncio.run(self.pipeline.inlet({'messages': [{'role': 'user', 'content': 'Hallo, wie kannst du mir unterstützen'}, {'role': 'assistant', 'content': 'Hallo, ich freue mich, dich bei deiner heutigen Tätigkeit im Verein zu unterstützen. Wie kann ich dir helfen?'}, {'role': 'user', 'content': 'Wann war das letzte Meeting?'}, {'role': 'assistant', 'content': 'Hallo, ich freue mich, dich bei deiner heutigen Tätigkeit im Verein zu unterstützen. Wie kann ich dir helfen?'}, {'role': 'user', 'content': 'Wann war das letzte Meeting'}]},
                                                 {"oauth_sub": "oidc@8284579b-93a6-49ec-a598-d84440fe5774"}))
        answer = self.pipeline.pipe("Hello", "-", "-", body)
        
        self.assertNotIn("Error", answer)
