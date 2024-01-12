FROM python:3.9
WORKDIR /backend

COPY ./requirements.txt /backend/requirements.txt
COPY ./app /backend/app
COPY main.py /backend/main.py

RUN pip install --no-cache-dir --upgrade -r /backend/requirements.txt


CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
