from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DeviceModel(BaseModel):
    name: str