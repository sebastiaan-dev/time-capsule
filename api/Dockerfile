FROM python:3.9
WORKDIR /api

COPY ./requirements.txt /api/requirements.txt
COPY ./app /api/app
COPY main.py /api/main.py

RUN pip install --no-cache-dir --upgrade -r /api/requirements.txt

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
