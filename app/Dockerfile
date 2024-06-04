FROM python:3.12

WORKDIR /app

ADD . /app

RUN pip install --trusted-host pypi.python.org -r requirements.txt

EXPOSE 8117

CMD ["uvicorn", "main:app","--host", "0.0.0.0", "--port", "8001", "--workers", "17", "--proxy-headers", "--forwarded-allow-ips", "*"]
