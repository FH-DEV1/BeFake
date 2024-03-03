import { NextResponse } from 'next/server';
import axios from 'axios';

export const POST = async (req: Request) => {
    let body = await req.json();
    let phone_number = body.phone

    let receipt_headers = {
        "content-type": "application/json",
        "accept": "*/*",
        "x-client-version": "iOS/FirebaseSDK/9.6.0/FirebaseCore-iOS",
        "x-ios-bundle-identifier": "AlexisBarreyat.BeReal",
        "accept-language": "en",
        "user-agent":
            "FirebaseAuth.iOS/9.6.0 AlexisBarreyat.BeReal/0.31.0 iPhone/14.7.1 hw/iPhone9_1",
        "x-firebase-locale": "en",
        "x-firebase-gmpid": "1:405768487586:ios:28c4df089ca92b89",
    }
    let receipt_body = { "appToken": "54F80A258C35A916B38A3AD83CA5DDD48A44BFE2461F90831E0F97EBA4BB2EC7" }
    let receipt_options = {
        url: "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyClient?key=AIzaSyDwjfEeparokD7sXPVQli9NsTuhT6fJ6iA",
        method: "POST",
        headers: receipt_headers,
        data: receipt_body,
    }

    let receipt_response = await axios.request(receipt_options);
    let receipt = receipt_response.data.receipt;

    let otp_request_headers = {
        "content-type": "application/json",
        "accept": "*/*",
        "x-client-version": "iOS/FirebaseSDK/9.6.0/FirebaseCore-iOS",
        "x-ios-bundle-identifier": "AlexisBarreyat.BeReal",
        "accept-language": "en",
        "user-agent":
            "FirebaseAuth.iOS/9.6.0 AlexisBarreyat.BeReal/0.28.2 iPhone/14.7.1 hw/iPhone9_1",
        "x-firebase-locale": "en",
        "x-firebase-gmpid": "1:405768487586:ios:28c4df089ca92b89",
    }
    let otp_request_body = {
        "phoneNumber": phone_number,
        "iosReceipt": receipt,
    }
    let otp_request_options = {
        url: "https://www.googleapis.com/identitytoolkit/v3/relyingparty/sendVerificationCode?key=AIzaSyDwjfEeparokD7sXPVQli9NsTuhT6fJ6iA",
        method: "POST",
        headers: otp_request_headers,
        data: otp_request_body,
    }
    try {
        const response = await axios.request(otp_request_options);
        console.log(response.data);
        return NextResponse.json(response.data);
    } catch (error: any) {
        console.log(error.response.data);
        return NextResponse.json({ status: "error", error: error.response.data });
    }

}