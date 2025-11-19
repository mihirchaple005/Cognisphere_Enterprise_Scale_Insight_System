import * as admin from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "my-next-app-93384",
      clientEmail: "firebase-adminsdk-fbsvc@my-next-app-93384.iam.gserviceaccount.com",
      privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCt3E+iG+j0OgMW\nYZv4UA1S6EIcYIBnOb432AStkejSqrt9Dd3G07RUjd33o5cLWid0pEisVy1dpOTR\ncXEz4QDek7kRX+BLXgC22pAo6XwkUbeg+1pD9PwQAq7ItCxV6O4qsYwaKHtpzJpx\n+FrqIaFZZ+qWMqg/hsVuXnz8myLaTf13lkG+YXW8iOFwrbm7F6CRcVJBgymuXUbg\nZ5m7QEOUx7x9yo3fA2yfjpNUvzj6/tOaO1MSfp70io0rqY8cRaNOYaioXF8Xq+RS\nyBs/JAUF21Jdx4WZ6neHoZpalHiC52fia6kNVzxmXbMV3enIzIbjX3voGZy7iD0g\nws4D9tG/AgMBAAECggEAAwY2DGfX4Yewzg7cm7EoyixoGf5DvYfvmyES08IZ/rAh\nmsdG+FJubJobJleeJQBod0r0SKsritl3cX07rt9XGIgRTBAS4ry73nJm149YLXmO\nbCpzI4N7bvvc9njL3KK0oeF8wme53dlFRn4/dpsnJ1r7Zalz68b4YDccjXhVXt69\nE07yeOlzaO2Yu2+cCDaNgOlMFRjGd6oAvlMaKL9TwYzOpcI68B4hp4LhHo2GJMnx\nNuVcKJCYff92olYiGZXSdp5OIQ7ukWhR3a6jrWODLCSsc5lTrGF4oQvRhTEBqup3\nOLP9f/n+vzKria+0PIblyv4bZHjDtZDRD1ISTOyNAQKBgQDgrNvL3N7AR4oAnqNZ\nfGoIu/xRUdnXJJwFSnVL56h27PDC3VilKF6BYjjt4DvQMP54YbRbSsQHOk8pB97f\nu7gJXLQgq//2WucPlQqc2Qe0oULBVm4HgiKqQnyD4hWH42CNkN0Vm0+9tZSAh/k6\n8dx+cM5rFOBIt3PgV322Mjs/4QKBgQDGGcTW7E6Jzpga+XySliAu3AOZ/6Mh7yaq\nm17iEiLqGcpa9ZTIv2Ly9HTxfAEB3qRJEVMU/XRKy08CuaBemSj8pvNtLmypVbhr\nMmYPApZZc+aUj3vKD3Bx+2NjfjdWJG/qrHTuLPpO0M34/Iw5Hhfu30bfvaF76emO\nKK3S4ULFnwKBgGwuT1cF7quexrAtsnGwGk5CVefCBaY2FnnltDzsOo2o4PSzJ6++\nlGKwLME9Kw+/x4enY/RhN6pTRTJ4e7Q26xJ29LSWnRS+CGvUU9vaFH/A9iepuikb\nXB2nDdVi0wMvVJpVml6A/hBWkj6hOjxLoOOw5XNiBex9iOoItps37JeBAoGBALy1\ng3sxNEe2U9MuYmrJM/MvhwbGLMKArJbM1wAIQtY6pzcqxgbNuhaypEv90n/TdTBd\nnoVaQ9OUBLoV1h0HTbIP38fb94r/q2QCaJJX5p1j+P0ACe4b8wPBc5Ytf81BfJNS\noTjaA7/czLko6vLmJepZK4yreg8ublwLiDpgd1kFAoGAK3KJ1YgJPXs/UoWY6fRQ\nHxcMSUTn7BBups1dsu3P22ZBvNmz7L/7zuFm7xgc5Xxl6S9veFWxgHvm58gGw2kz\nvLNQzmitD2/OYkE411IFbpaMnlbKXHvHNkjgKOLBJU1GOJbnaupgvRVqDklEYLcu\nyHbQZgYuaJQCP9JPk31YFWU=\n-----END PRIVATE KEY-----\n",
 }),
  });
}

export const adminAuth=admin.auth();
export const adminDB= admin.firestore();
export const bucket=getStorage().bucket("my-next-app-93384.appspot.com");