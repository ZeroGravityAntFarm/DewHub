FROM python:3.11

WORKDIR /app

ADD . /app

RUN pip install --trusted-host pypi.python.org -r requirements.txt

EXPOSE 8117

CMD ["python", "main.py"]
