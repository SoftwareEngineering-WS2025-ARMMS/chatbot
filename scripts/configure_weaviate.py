import weaviate

import weaviate.classes.config as wc
from weaviate.classes.config import Configure
import os

client.collections.create(
    name="Documents",
    properties=[
        wc.Property(name="conent", data_type=wc.DataType.TEXT),
        wc.Property(name="metadata", data_type=wc.DataType.TEXT),
    ],
    # Define the vectorizer module
    # vectorizer_config=wc.Configure.Vectorizer.text2vec_openai(),
    # Define the generative module
    # generative_config=wc.Configure.Generative.openai(),

    multi_tenancy_config=Configure.multi_tenancy(
        enabled=True,
        auto_tenant_creation=True
    )
)

client.close()