"use client"
import { ChangeEvent, useEffect, useState } from 'react';
import PhoneInput from 'react-phone-number-input'
import './phoneInput.css'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Draggable from 'react-draggable';
import SwipeableViews from 'react-swipeable-views';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import NearMeIcon from '@mui/icons-material/NearMe';
import ScreenRotationAltIcon from '@mui/icons-material/ScreenRotationAlt';


const Home: React.FC = () => {
    const domain = "https://berealapi.fly.dev"
    const [phone, setPhone] = useState("")
    const [OTPsession, setOTPsession] = useState("")
    const [OTPcode, setOTPcode] = useState("")    
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState("start")
    const [feed, setFeed] = useState(
      {
        "placeholder": true,
        "data": {
          "data": {
            "userPosts": {},
            "friendsPosts": [
                {
                    "user": {
                        "id": "id",
                        "username": "username",
                        "profilePicture": {
                            "url": "/icon.png",
                            "width": 2000,
                            "height": 2000
                        }
                    },
                    "momentId": "QxTisSpb4U3j73KOSP-K6",
                    "region": "europe-west",
                    "moment": {
                        "id": "QxTisSpb4U3j73KOSP-K6",
                        "region": "europe-west"
                    },
                    "posts": [
                        {
                            "id": "thH6WgFz-HfVDMWIk66bW",
                            "primary": {
                                "url": "https://placehold.co/600x400",
                                "width": 2000,
                                "height": 2000,
                                "mediaType": "image"
                            },
                            "secondary": {
                                "url": "/icon.png",
                                "width": 2000,
                                "height": 2000,
                                "mediaType": "image"
                            },
                            "retakeCounter": 0,
                            "lateInSeconds": 0,
                            "isLate": false,
                            "isMain": true,
                            "takenAt": "2023-12-06T14:36:44.661Z",
                            "postedAt": "2023-12-06T14:37:01.494Z",
                            "realMojis": [
                                {
                                    "id": "realid",
                                    "user": {
                                        "id": "userrealid",
                                        "username": "usernamereal",
                                        "profilePicture": {
                                            "url": "/icon.png",
                                            "width": 2000,
                                            "height": 2000
                                        }
                                    },
                                    "media": {
                                        "url": "/icon.png",
                                        "width": 2000,
                                        "height": 2000
                                    },
                                    "type": "up",
                                    "emoji": "👍",
                                    "isInstant": false,
                                    "postedAt": "2023-12-06T14:38:10.409Z"
                                }
                            ],
                            "comments": [],
                            "caption": "caption",
                            "tags": [],
                            "creationDate": "2023-12-06T14:37:01.494Z",
                            "updatedAt": "2023-12-06T14:37:01.494Z",
                            "visibility": [
                                "friends",
                                "friends-of-friends"
                            ],
                            "origin": null,
                            "postType": "default"
                        },
                        {
                          "id": "thH6WgFz-HfVDMWIk66bW",
                          "primary": {
                              "url": "/icon.png",
                              "width": 2000,
                              "height": 2000,
                              "mediaType": "image"
                          },
                          "secondary": {
                              "url": "https://placehold.co/600x400",
                              "width": 2000,
                              "height": 2000,
                              "mediaType": "image"
                          },
                          "location": {
                              "latitude": 0,
                              "longitude": 0
                          },
                          "retakeCounter": 0,
                          "lateInSeconds": 0,
                          "isLate": false,
                          "isMain": true,
                          "takenAt": "2023-12-06T14:36:44.661Z",
                          "postedAt": "2023-12-06T14:37:01.494Z",
                          "realMojis": [
                              {
                                  "id": "realid",
                                  "user": {
                                      "id": "userrealid",
                                      "username": "usernamereal",
                                      "profilePicture": {
                                          "url": "/icon.png",
                                          "width": 2000,
                                          "height": 2000
                                      }
                                  },
                                  "media": {
                                      "url": "/icon.png",
                                      "width": 2000,
                                      "height": 2000
                                  },
                                  "type": "up",
                                  "emoji": "👍",
                                  "isInstant": false,
                                  "postedAt": "2023-12-06T14:38:10.409Z"
                              }
                          ],
                          "comments": [],
                          "tags": [
                            {
                                "userId": "id",
                                "user": {
                                    "id": "id",
                                    "username": "username",
                                    "fullname": "fullname",
                                    "profilePicture": {
                                        "url": "pp",
                                        "width": 1000,
                                        "height": 1000
                                    }
                                },
                                "searchText": "searchText",
                                "endIndex": 5,
                                "isUntagged": false,
                                "replaceText": "replaceText",
                                "type": "mention"
                            },
                            {
                              "userId": "id",
                              "user": {
                                  "id": "id",
                                  "username": "username",
                                  "fullname": "fullname",
                                  "profilePicture": {
                                      "url": "pp",
                                      "width": 1000,
                                      "height": 1000
                                  }
                              },
                              "searchText": "searchText",
                              "endIndex": 5,
                              "isUntagged": false,
                              "replaceText": "replaceText",
                              "type": "mention"
                          },
                          {
                            "userId": "id",
                            "user": {
                                "id": "id",
                                "username": "username",
                                "fullname": "fullname",
                                "profilePicture": {
                                    "url": "pp",
                                    "width": 1000,
                                    "height": 1000
                                }
                            },
                            "searchText": "searchText",
                            "endIndex": 5,
                            "isUntagged": false,
                            "replaceText": "replaceText",
                            "type": "mention"
                        }
                        ],
                          "creationDate": "2023-12-06T14:37:01.494Z",
                          "updatedAt": "2023-12-06T14:37:01.494Z",
                          "visibility": [
                              "friends",
                              "friends-of-friends"
                          ],
                          "origin": null,
                          "postType": "default"
                      }
                    ]
                }
          ]}}})
    const [FOFfeed, setFOFfeed] = useState({
      "status": 200,
      "message": "Feed generated",
      "data": [
          {
              "id": "id",
              "user": {
                  "id": "id",
                  "username": "username",
                  "profilePicture": {
                      "url": "/icon.png",
                      "width": 999,
                      "height": 999
                  },
                  "relationship": {
                      "commonFriends": [
                          {
                              "id": "id",
                              "username": "username",
                              "fullname": "fullname",
                              "profilePicture": {
                                  "url": "/icon.png",
                                  "width": 1000,
                                  "height": 1000
                              }
                          },
                          {
                              "id": "id",
                              "username": "username",
                              "fullname": "fullname",
                              "profilePicture": {
                                  "url": "/icon.png",
                                  "width": 1000,
                                  "height": 1000
                              }
                          }
                      ]
                  }
              },
              "moment": {
                  "id": "b41mOSq8grtDfb3DlRj8y",
                  "region": "europe-west"
              },
              "primary": {
                  "url": "/icon.png",
                  "width": 1500,
                  "height": 2000,
                  "mediaType": "image"
              },
              "secondary": {
                  "url": "/icon.png",
                  "width": 1500,
                  "height": 2000,
                  "mediaType": "image"
              },
              "caption": "caption",
              "takenAt": "2023-12-18T20:54:38.149Z",
              "postedAt": "2023-12-18T20:54:59.893Z",
              "lateInSeconds": 11193,
              "location": {
                  "latitude": 0,
                  "longitude": 0
              },
              "realmojis": {
                  "total": 5,
                  "sample": [
                    {
                      "id": "realid",
                      "user": {
                          "id": "userrealid",
                          "username": "usernamereal",
                          "profilePicture": {
                              "url": "/icon.png",
                              "width": 2000,
                              "height": 2000
                          }
                      },
                      "media": {
                          "url": "/icon.png",
                          "width": 2000,
                          "height": 2000
                      },
                      "type": "up",
                      "emoji": "👍",
                      "isInstant": false,
                      "postedAt": "2023-12-06T14:38:10.409Z"
                  }
                  ]
              },
              "tags": [                            {
                "userId": "id",
                "user": {
                    "id": "id",
                    "username": "username",
                    "fullname": "fullname",
                    "profilePicture": {
                        "url": "pp",
                        "width": 1000,
                        "height": 1000
                    }
                },
                "searchText": "searchText",
                "endIndex": 5,
                "isUntagged": false,
                "replaceText": "replaceText",
                "type": "mention"
            }]
        }
      ]
    })
    const [selectedPost, setSelectedPost] = useState({
      "from": "feed",
      "id": "id",
      "username": "usesrname",
      "profilePicture": "/icon.png",
      "primary": {
        "url": "https://placehold.co/600x400",
        "width": 2000,
        "height": 2000,
        "mediaType": "image"
      },
      "secondary": {
          "url": "/icon.png",
          "width": 2000,
          "height": 2000,
          "mediaType": "image"
      },
      "realMojis": [
        {
            "id": "realid",
            "user": {
                "id": "userrealid",
                "username": "usernamereal",
                "profilePicture": {
                    "url": "/icon.png",
                    "width": 2000,
                    "height": 2000
                }
            },
            "media": {
                "url": "/icon.png",
                "width": 2000,
                "height": 2000
            },
            "type": "up",
            "emoji": "👍",
            "isInstant": false,
            "postedAt": "2023-12-06T14:38:10.409Z"
        }
      ],
      "lateInSeconds": 0,
      "takenAt": "2023-12-06T14:36:44.661Z",
      "location": {
        "latitude": 180,
        "longitude": 180
      },
      "comments": [{
        "id": "id",
        "user": {
            "id": "id",
            "username": "username",
            "profilePicture": {
                "url": "/icon",
                "width": 1000,
                "height": 1000
            }
        },
        "content": "comment",
        "postedAt": "2023-12-07T20:27:37.092Z"
    }],
      "tags": [
        {
            "userId": "id",
            "user": {
                "id": "id",
                "username": "",
                "fullname": "",
                "profilePicture": {
                    "url": "/icon.png",
                    "width": 1000,
                    "height": 1000
                }
            },
            "searchText": "searchText",
            "endIndex": 5,
            "isUntagged": false,
            "replaceText": "replaceText",
            "type": "mention"
        }
      ],
      "retakeCounter": 0,
    })
    const token = typeof window !== "undefined" ? localStorage.getItem('token') : null
    const [selectedImages, setSelectedImages] = useState<{ [key: string]: boolean }>({});
    const [posImages, setPosImages] = useState<{ [key: string]: { x: number; y: number } }>({});
    const [isScrolled, setIsScrolled] = useState(true);
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [feedScrollPos, setFeedScrollPos] = useState(0);
    const [swipeable, setSwipeable] = useState(false)
    const [tagModalVisible, setTagModalVisible] = useState(false)
    const [tagModalInfo, setTagModalInfo] = useState({
      "tags": [
        {
            "userId": "id",
            "user": {
                "id": "id",
                "username": "username",
                "fullname": "fullname",
                "profilePicture": {
                    "url": "/icon.png",
                    "width": 1000,
                    "height": 1000
                }
            },
            "searchText": "searchText",
            "endIndex": 5,
            "isUntagged": false,
            "replaceText": "replaceText",
            "type": "mention"
        }
    ]})

    useEffect(() => {
      if (page === "start") {
        refreshToken();
      }
    
      const handleScroll = () => {
        const ScrollY = window.scrollY;
        setPrevScrollPos(prevScrollPos => {
          const shouldShow = ScrollY < 50 || ScrollY < prevScrollPos;
          setIsScrolled(shouldShow);
          return ScrollY;
        });
      };
    
      if (page === "feed" || page === "fof") {
        window.addEventListener('scroll', handleScroll);
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      }
    }, [page]);
    

    function formatTime(seconds: number) {
      const minutes = Math.round(seconds / 60);
      const hours = Math.round(minutes / 60);
  
      if (seconds >= 3600) {
        return `${hours}h late`;
      } else if (seconds >= 60){
        return `${minutes} min late`;
      } else {
        return `${seconds}s late`;
      }
    }

    const handleImageClick = (postIndex: string, imageIndex: number) => {
      const newSelectedImages = { ...selectedImages };
      const key = `${postIndex}_${imageIndex}`;
      if (newSelectedImages[key]) {
        delete newSelectedImages[key];
      } else {
        newSelectedImages[key] = true;
      }
      setSelectedImages(newSelectedImages);
    };

    const UTCtoParis = (utcTime: string) => {
      const date = new Date(utcTime);
      const localTime = date.toLocaleTimeString('en-US', { hour12: false });
  
      return localTime;
  };

  const handleStopDrag = (postId: string, imageIndex: number, data: { x: number; y: number }) => {
    setSwipeable(false)
    const key = `${postId}_${imageIndex}`;
    const newPosition = {
      x: data.x <= (screen.width/2)-66 ? 12 : screen.width-124,
      y: 0,
    };
    setPosImages((prevPosImages) => ({
      ...prevPosImages,
      [key]: newPosition,
    }));
  }

    //start
    const refreshToken = () => {
      if (token) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
  
        const requestOptions = {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({ token }),
          redirects: 'follow',
        };
  
        fetch(`${domain}/login/refresh`, requestOptions)
          .then((response) => response.text())
          .then((result) => {
            if (JSON.parse(result).status == 201){
              if (typeof window !== "undefined") {
                console.log('token', JSON.parse(result).data.token)
                localStorage.setItem('token', JSON.parse(result).data.token);
                getFeed(JSON.parse(result).data.token)
              }
            }
            else {
              toast.error("Erreur Token invalide")
              setPage("login")
            }
          })
          .catch(() => {
            toast.error("Erreur Token invalide")
            setPage("login")
          });
      }
      else {
        setPage("login")
      }
    };

  //feed
  const getFeed = (JWToken: string) => {
    const headers = new Headers();
    headers.append("token", (JWToken == null ? "error" : JWToken));

    const requestOptions = {
        method: 'GET',
        headers: headers,
    };

    fetch(`${domain}/friends/feed`, requestOptions)
    .then(response => response.text())
    .then(result => {
      if (JSON.parse(result).status == 200) {
        setFeed(JSON.parse(result))
        setPage("feed")
        window.scroll(0, 0);
        setLoading(false)
      }
      else {
        toast.warning("Erreur lors du chargement des Bereal.")
        setPage("feedError")
        setLoading(false)
      }
    })
    .catch(() => {toast.error("Erreur lors du chargement des BeReal.");setPage("feedError") ;setLoading(false)});
  }

    //FOFfeed
    const getFOFfeed = () => {
      const headers = new Headers();
      headers.append("token", (token == null ? "error" : token));
  
      const requestOptions = {
          method: 'GET',
          headers: headers,
      };
  
      fetch(`${domain}/friends/friends-of-friends`, requestOptions)
      .then(response => response.text())
      .then(result => {
        if (JSON.parse(result).status == 200) {
          setFOFfeed(JSON.parse(result))
          setPage("fof")
          window.scroll(0, 0);
          setLoading(false)
        }
        else {
          toast.warning("Erreur lors du chargement des Bereal.")
          setLoading(false)
        }
      })
      .catch(() => {toast.error("Erreur lors du chargement des BeReal.");setLoading(false)});
    }

    //login
    const sendOTP = () => {
        setLoading(true)
        const headers = new Headers();
        headers.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({"phone": phone}),
        };

        fetch(`${domain}/login/send-code`, requestOptions)
        .then(response => response.text())
        .then(result => {
          setLoading(false)
          if (JSON.parse(result).status == 201) {
            setOTPsession(JSON.parse(result).data.otpSession)
            setPage("OTP")
            toast.success("OTP envoyé avec succès!")
          }
          else {
            toast.error("Erreur lors de l'envoie de l'OTP.")
          }
        })
        .catch(() => toast.error("Erreur lors de l'envoie de l'OTP."));
    }

    //OTP
    const validateOTP = () => {
        setLoading(true)
        const headers = new Headers();
        headers.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({"code": OTPcode, "otpSession": OTPsession}),
        };

        fetch(`${domain}/login/verify`, requestOptions)
        .then(response => response.text())
        .then(result => {
          setLoading(false)
          if (JSON.parse(result).status == 201) {
            if (typeof window !== "undefined") {
              localStorage.setItem('token', JSON.parse(result).data.token);
              getFeed(JSON.parse(result).data.token)
              setPage("feed")
              toast.success("OTP validé avec succès!")
            }
          }
          else {
            toast.error("Erreur lors de la validation de l'OTP.")
          }
        })
        .catch(() => toast.error("Erreur lors de la validation de l'OTP."));
    }


    return (
        <>
        <div>
            <svg width="110" height="45" viewBox="0 0 2000 824" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${page == "start" || page == "onePostFeed" || page == "feedError" ? "hidden" : "block"} fixed w-full z-50`}>
                <path fillRule="evenodd" clipRule="evenodd" d="M1669.95 569.565H1736V506.768H1669.95V569.565ZM401.716 429.211H327.904V519.168H397.258C414.426 519.168 428.219 515.406 438.622 507.865C449.025 500.329 454.227 489.659 454.227 475.838C454.227 460.767 449.433 449.228 439.861 441.221C430.278 433.22 417.569 429.211 401.716 429.211ZM380.415 300.162H327.904V379.758H375.461C393.295 379.758 407.243 376.545 417.321 370.103C427.394 363.671 432.43 353.545 432.43 339.725C432.43 324.658 427.801 314.297 418.559 308.64C409.307 302.988 396.592 300.162 380.415 300.162ZM389.827 249.296C422.522 249.296 449.102 256.125 469.584 269.784C490.054 283.448 500.298 306.447 500.298 338.783C500.298 350.719 497.402 361.473 491.628 371.045C485.849 380.627 478.33 388.869 469.088 395.771C484.275 403.307 496.747 413.517 506.49 426.385C516.227 439.264 521.104 455.586 521.104 475.367C521.104 504.887 510.282 527.965 488.656 544.606C467.019 561.248 438.204 569.563 402.212 569.563H264V249.296H389.827ZM716.126 432.507C712.818 417.132 706.873 405.745 698.292 398.366C689.7 390.988 678.972 387.293 666.092 387.293C652.876 387.293 641.818 391.145 632.901 398.832C623.985 406.53 618.2 417.755 615.563 432.507H716.126ZM680.954 575.22C639.341 575.22 606.558 564.382 582.62 542.722C558.671 521.057 546.705 492.013 546.705 455.585C546.705 419.168 557.521 389.967 579.152 367.983C600.779 346.009 630.254 335.019 667.578 335.019C705.227 335.019 732.881 346.873 750.555 370.579C768.218 394.285 777.058 422.313 777.058 454.643V473.483H615.068C618.04 488.554 625.3 500.569 636.864 509.518C648.423 518.467 663.615 522.936 682.44 522.936C693.338 522.936 703.163 521.606 711.915 518.938C720.661 516.274 730.817 512.422 742.381 507.398L761.206 551.671C749.971 559.834 736.348 565.8 720.336 569.563C704.314 573.331 691.186 575.22 680.954 575.22ZM909.964 300.164H870.333V398.128H910.954C930.104 398.128 945.956 394.444 958.511 387.06C971.061 379.686 977.336 367.514 977.336 350.559C977.336 332.661 971.391 319.788 959.502 311.938C947.613 304.094 931.094 300.164 909.964 300.164ZM1002.11 569.565L930.77 447.11C927.131 447.424 923.339 447.659 919.376 447.816C915.413 447.978 911.45 448.052 907.487 448.052H870.333V569.565H806.429V249.298H911.945C948.603 249.298 979.972 257.305 1006.06 273.318C1032.16 289.331 1045.21 314.136 1045.21 347.733C1045.21 367.514 1039.83 384.548 1029.1 398.834C1018.36 413.121 1004.58 424.194 987.739 432.038L1070.47 569.565H1002.11ZM1231.56 432.507C1228.26 417.132 1222.31 405.745 1213.73 398.366C1205.13 390.988 1194.41 387.293 1181.53 387.293C1168.32 387.293 1157.25 391.145 1148.34 398.832C1139.42 406.53 1133.64 417.755 1131 432.507H1231.56ZM1196.39 575.22C1154.78 575.22 1122 564.382 1098.05 542.722C1074.11 521.057 1062.14 492.013 1062.14 455.585C1062.14 419.168 1072.95 389.967 1094.59 367.983C1116.22 346.009 1145.69 335.019 1183.02 335.019C1220.67 335.019 1248.32 346.873 1265.99 370.579C1283.66 394.285 1292.49 422.313 1292.49 454.643V473.483H1130.51C1133.48 488.554 1140.73 500.569 1152.3 509.518C1163.86 518.467 1179.05 522.936 1197.88 522.936C1208.77 522.936 1218.6 521.606 1227.35 518.938C1236.09 516.274 1246.26 512.422 1257.82 507.398L1276.64 551.671C1265.41 559.834 1251.79 565.8 1235.78 569.563C1219.75 573.331 1206.63 575.22 1196.39 575.22ZM1414.95 527.997C1444.17 527.997 1465.59 510.183 1465.59 486.43V470.103L1416.29 473.065C1391.08 474.551 1377.92 484.729 1377.92 500.852V501.276C1377.92 518.027 1392.42 527.997 1414.95 527.997ZM1313.45 504.453V504.034C1313.45 462.677 1347.13 438.494 1406.48 434.889L1465.59 431.498V417.504C1465.59 397.352 1451.75 384.839 1426.32 384.839C1402.01 384.839 1387.29 395.656 1384.17 410.288L1383.72 412.198H1324.16L1324.38 409.655C1327.95 367.659 1365.87 337.542 1429 337.542C1490.79 337.542 1530.72 367.874 1530.72 413.679V569.563H1465.59V535.632H1464.25C1450.64 558.961 1425.21 573.169 1393.75 573.169C1345.8 573.169 1313.45 544.538 1313.45 504.453ZM1566.18 569.565H1634.46V248.78H1566.18V569.565Z" fill="white" />
            </svg>

            {/* start */}
            <div className={`${page == "start" ? "block" : "hidden"} flex items-center justify-center flex-col h-[90vh]`}>
              <svg width="200" height="83" viewBox="0 0 2000 824" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                  <path fillRule="evenodd" clipRule="evenodd" d="M1669.95 569.565H1736V506.768H1669.95V569.565ZM401.716 429.211H327.904V519.168H397.258C414.426 519.168 428.219 515.406 438.622 507.865C449.025 500.329 454.227 489.659 454.227 475.838C454.227 460.767 449.433 449.228 439.861 441.221C430.278 433.22 417.569 429.211 401.716 429.211ZM380.415 300.162H327.904V379.758H375.461C393.295 379.758 407.243 376.545 417.321 370.103C427.394 363.671 432.43 353.545 432.43 339.725C432.43 324.658 427.801 314.297 418.559 308.64C409.307 302.988 396.592 300.162 380.415 300.162ZM389.827 249.296C422.522 249.296 449.102 256.125 469.584 269.784C490.054 283.448 500.298 306.447 500.298 338.783C500.298 350.719 497.402 361.473 491.628 371.045C485.849 380.627 478.33 388.869 469.088 395.771C484.275 403.307 496.747 413.517 506.49 426.385C516.227 439.264 521.104 455.586 521.104 475.367C521.104 504.887 510.282 527.965 488.656 544.606C467.019 561.248 438.204 569.563 402.212 569.563H264V249.296H389.827ZM716.126 432.507C712.818 417.132 706.873 405.745 698.292 398.366C689.7 390.988 678.972 387.293 666.092 387.293C652.876 387.293 641.818 391.145 632.901 398.832C623.985 406.53 618.2 417.755 615.563 432.507H716.126ZM680.954 575.22C639.341 575.22 606.558 564.382 582.62 542.722C558.671 521.057 546.705 492.013 546.705 455.585C546.705 419.168 557.521 389.967 579.152 367.983C600.779 346.009 630.254 335.019 667.578 335.019C705.227 335.019 732.881 346.873 750.555 370.579C768.218 394.285 777.058 422.313 777.058 454.643V473.483H615.068C618.04 488.554 625.3 500.569 636.864 509.518C648.423 518.467 663.615 522.936 682.44 522.936C693.338 522.936 703.163 521.606 711.915 518.938C720.661 516.274 730.817 512.422 742.381 507.398L761.206 551.671C749.971 559.834 736.348 565.8 720.336 569.563C704.314 573.331 691.186 575.22 680.954 575.22ZM909.964 300.164H870.333V398.128H910.954C930.104 398.128 945.956 394.444 958.511 387.06C971.061 379.686 977.336 367.514 977.336 350.559C977.336 332.661 971.391 319.788 959.502 311.938C947.613 304.094 931.094 300.164 909.964 300.164ZM1002.11 569.565L930.77 447.11C927.131 447.424 923.339 447.659 919.376 447.816C915.413 447.978 911.45 448.052 907.487 448.052H870.333V569.565H806.429V249.298H911.945C948.603 249.298 979.972 257.305 1006.06 273.318C1032.16 289.331 1045.21 314.136 1045.21 347.733C1045.21 367.514 1039.83 384.548 1029.1 398.834C1018.36 413.121 1004.58 424.194 987.739 432.038L1070.47 569.565H1002.11ZM1231.56 432.507C1228.26 417.132 1222.31 405.745 1213.73 398.366C1205.13 390.988 1194.41 387.293 1181.53 387.293C1168.32 387.293 1157.25 391.145 1148.34 398.832C1139.42 406.53 1133.64 417.755 1131 432.507H1231.56ZM1196.39 575.22C1154.78 575.22 1122 564.382 1098.05 542.722C1074.11 521.057 1062.14 492.013 1062.14 455.585C1062.14 419.168 1072.95 389.967 1094.59 367.983C1116.22 346.009 1145.69 335.019 1183.02 335.019C1220.67 335.019 1248.32 346.873 1265.99 370.579C1283.66 394.285 1292.49 422.313 1292.49 454.643V473.483H1130.51C1133.48 488.554 1140.73 500.569 1152.3 509.518C1163.86 518.467 1179.05 522.936 1197.88 522.936C1208.77 522.936 1218.6 521.606 1227.35 518.938C1236.09 516.274 1246.26 512.422 1257.82 507.398L1276.64 551.671C1265.41 559.834 1251.79 565.8 1235.78 569.563C1219.75 573.331 1206.63 575.22 1196.39 575.22ZM1414.95 527.997C1444.17 527.997 1465.59 510.183 1465.59 486.43V470.103L1416.29 473.065C1391.08 474.551 1377.92 484.729 1377.92 500.852V501.276C1377.92 518.027 1392.42 527.997 1414.95 527.997ZM1313.45 504.453V504.034C1313.45 462.677 1347.13 438.494 1406.48 434.889L1465.59 431.498V417.504C1465.59 397.352 1451.75 384.839 1426.32 384.839C1402.01 384.839 1387.29 395.656 1384.17 410.288L1383.72 412.198H1324.16L1324.38 409.655C1327.95 367.659 1365.87 337.542 1429 337.542C1490.79 337.542 1530.72 367.874 1530.72 413.679V569.563H1465.59V535.632H1464.25C1450.64 558.961 1425.21 573.169 1393.75 573.169C1345.8 573.169 1313.45 544.538 1313.45 504.453ZM1566.18 569.565H1634.46V248.78H1566.18V569.565Z" fill="white" />
              </svg>
              <div className="mt-[26px] h-7 w-7 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
              </div>
            </div>

            {/* login */}
            <div className={`${page == "login" ? "block" : "hidden"} flex items-center justify-center flex-col h-[90vh]`}>
                <h1 className="pb-6 text-xl opacity-50 -mt-24">Numéro de téléphone</h1>
                <PhoneInput
                    international
                    defaultCountry="FR"
                    value={phone}
                    autoComplete='phone'
                    onChange={(phoneInput: string) => setPhone(phoneInput)}
                    pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                    id="phone"
                     />
                <button onClick={sendOTP} className={`${loading ? "hidden" : "block"} mt-6 py-0.5 px-1.5 rounded-md border border-white border-opacity-50`}>valider</button>
                <div className={`${loading ? "block" : "hidden"} mt-[26px] h-7 w-7 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`} role="status">
                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                </div>
            </div>



            {/* OTP */}
            <div className={`${page == "OTP" ? "block" : "hidden"} flex items-center justify-center flex-col h-[90vh]`}>
                <h1 className="pb-6 text-xl opacity-50 -mt-24 ">Code de validation</h1>
                <input
                    type="text"
                    value={OTPcode} 
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setOTPcode(e.target.value)}
                    className="bg-black border-white border-opacity-50 rounded-none text-left tracking-[6px] w-24 focus:outline-none"
                    id="otp"
                    inputMode='numeric'
                    maxLength={6}
                />
                <div className='flex'>
                  <span className='h-0.5 bg-white w-2 mr-2'/>
                  <span className='h-0.5 bg-white w-2 mr-2'/>
                  <span className='h-0.5 bg-white w-2 mr-2'/>
                  <span className='h-0.5 bg-white w-2 mr-2'/>
                  <span className='h-0.5 bg-white w-2 mr-2'/>
                  <span className='h-0.5 bg-white w-2 mr-2'/>
                </div>
                <button onClick={validateOTP} className={`${loading ? "hidden" : "block"} mt-6 py-0.5 px-1.5 rounded-md border border-white border-opacity-50`}>valider</button>
                <div className={`${loading ? "block" : "hidden"} mt-[26px] h-7 w-7 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`} role="status">
                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                </div>
            </div>


            {/* feed */}
            <div className={`${page == "feed" ? "block" : "hidden"} pt-11 pb-11`}>
              <div className={`${feed.data.data.userPosts ? isScrolled ? "block" : "hidden" : "hidden"} z-50`}>
                <div className='flex text-white justify-center mt-2 fixed w-full z-50'>
                  <p className='mr-2'>Mes Amis</p>
                  <p className={`ml-2 opacity-50 ${loading ? "hidden" : "block"}`} onClick={() => {getFOFfeed(); setLoading(true)}}>Amis d'Amis</p>
                  <div className={`${loading ? "block" : "hidden"} mt-1 ml-3 h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`} role="status">
                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                  </div>
                </div>
              </div>
              <div className={`flex flex-col-reverse ${feed.data.data.userPosts ? "mt-8" : "mt-0"}`}>
                {feed && feed.data.data.friendsPosts.map((post) => (
                  <div className="mt-10 overflow-visible" key={post.user.id}>
                    <SwipeableViews disabled={swipeable} index={post.posts.length-1}>
                    {post.posts.map((userPost, imageIndex) => (
                      <div className='flex flex-col' key={`${userPost.id}_${imageIndex}`}>
                        <div className='flex mb-1.5'>
                          <img className='w-9 h-9 rounded-full' src={JSON.stringify(post.user.profilePicture) == "null" ? "/icon.png" : post.user.profilePicture.url} alt={`${post.user.username}'s profile`} />
                          <div className='flex-col ml-2'>
                            <div className='h-4 flex' onClick={() => {
                              if (JSON.stringify(userPost.tags) !== "[]") {
                                setTagModalInfo({
                                  "tags": userPost.tags
                                }); setTagModalVisible(true)
                              }
                              }}>
                              {post.user.username}
                              {JSON.stringify(userPost.tags) == "[]" ? "" : 
                              ` avec${userPost.tags.length > 2 ? ` ${userPost.tags[0].user.username} et ${userPost.tags.length-1} autres` : userPost.tags.map((tag) => (` ${tag.user.username}`))}`
                              }
                            </div>
                            <a
                              className='text-sm opacity-60 cursor-pointer'
                              target="_blank"
                              rel="noopener noreferrer"
                              href={userPost.location ? `https://www.google.com/maps/?q=${userPost.location.latitude},${userPost.location.longitude}` : undefined}
                              onClick={(e) => {
                                if (!userPost.location) {
                                  e.preventDefault();
                                }
                              }}
                            >
                              {userPost.location ? `ouvrir dans maps • ` : ""}
                              {userPost.isLate ? formatTime(userPost.lateInSeconds) : UTCtoParis(userPost.takenAt)}
                            </a>
                          </div>
                        </div>
                        <div className='relative' onClick={() => handleImageClick(userPost.id, imageIndex)}>
                          <img
                            className="h-[65vh] w-full rounded-3xl object-cover"
                            src={selectedImages[`${userPost.id}_${imageIndex}`] ? userPost.secondary.url : userPost.primary.url}
                            alt={`Image ${imageIndex}`}
                          />
                          <Draggable 
                            bounds="parent" 
                            onStart={() => {setSwipeable(true)}}
                            onStop={(e, data) => handleStopDrag(userPost.id, imageIndex, data)}
                            defaultPosition={{x: 12, y: 0}}
                            position={posImages[`${userPost.id}_${imageIndex}`] || { x: 12, y: 0 }}
                          >
                            <img
                              className={`top-3 absolute w-28 h-36 rounded-xl border-2 border-black object-cover ${swipeable ? "" : "transition-transform duration-500"}`}
                              src={selectedImages[`${userPost.id}_${imageIndex}`] ? userPost.primary.url : userPost.secondary.url}
                              alt={`Image ${imageIndex}`}
                            />
                          </Draggable>
                        </div>
                        <div className={`flex ml-7 -mt-14 ${userPost.realMojis[0] ? "mb-0" : "mb-10"} z-50`} onClick={() => {
                          setSelectedPost({
                            "from": "feed",
                            "username": post.user.username,
                            "profilePicture": post.user.profilePicture ? post.user.profilePicture.url : "/icon.png",
                            "primary": userPost.primary,
                            "secondary": userPost.secondary,
                            "realMojis": userPost.realMojis,
                            "lateInSeconds": userPost.lateInSeconds,
                            "takenAt": userPost.takenAt,
                            "location": userPost.location || {"latitude": 180, "longitude": 180},
                            "comments": userPost.comments,
                            "tags": userPost.tags,
                            "retakeCounter": userPost.retakeCounter,
                            "id": userPost.id

                          });
                          setFeedScrollPos(window.scrollY);
                          setPage("onePostFeed")
                        }}>
                          {userPost.realMojis.slice(0, 3).map((realMojis, index) => (
                            <div className='flex flex-row -ml-2.5' key={`${userPost.id}_realMojis_${index}`}>
                              <img
                                className={`w-8 h-8 rounded-full border border-black `}
                                src={realMojis.media.url}
                                alt={`Realmoji ${index + 1}`}
                              />
                              {index === 2 && userPost.realMojis.length > 3 && (
                                <div className={`absolute flex items-center justify-center text-white text-sm h-8 w-8 rounded-full bg-black bg-opacity-70`}>
                                  {userPost.realMojis.length > 4 ? "3+" : "+2" }
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className='flex justify-center mt-9'>
                          {post.posts.length >= 2 && post.posts.map((dots) => (
                            <span className={`bg-white w-2 h-2 rounded-full mx-1 mb-3 ${dots === userPost ? "" : "opacity-50"}`} />
                          ))}
                        </div>
                        {userPost.caption ? <p className='ml-2'>{userPost.caption}</p> : ""}
                        <div className='ml-2 opacity-50' onClick={() => {
                          setSelectedPost({
                            "from": "feed",
                            "username": post.user.username,
                            "profilePicture": post.user.profilePicture ? post.user.profilePicture.url : "/icon.png",
                            "primary": userPost.primary,
                            "secondary": userPost.secondary,
                            "realMojis": userPost.realMojis,
                            "lateInSeconds": userPost.lateInSeconds,
                            "takenAt": userPost.takenAt,
                            "location": userPost.location || {"latitude": 180, "longitude": 180},
                            "comments": userPost.comments,
                            "tags": userPost.tags,
                            "retakeCounter": userPost.retakeCounter,
                            "id": userPost.id

                          });
                          setFeedScrollPos(window.scrollY);
                          setPage("onePostFeed")
                        }}>
                          {userPost.comments.length == 0 ? "Ajouter un commentaire..." : userPost.comments.length == 1 ? "Voir le commentaire" : `Voir les ${userPost.comments.length} commentaires`}
                        </div>
                      </div>
                    ))}
                    </SwipeableViews>
                  </div>
                ))}
              </div>
            </div>
            

            {/* tagModal */}
            <div className={`${tagModalVisible ? "" : "translate-y-full"} transition-transform duration-300 block fixed top-0 bg-black bg-opacity-40 h-[100vh] w-[100vw]`} onClick={() => setTagModalVisible(false)}>
              <div className={`${tagModalVisible ? "" : "translate-y-full"} transition-transform block fixed top-1/3 bg-zinc-900 w-[100vw] h-[67vh] rounded-t-3xl`}>
                <div className='flex flex-col ml-5 mt-10'>
                  {tagModalInfo.tags.map((tag) => (
                    <div className='flex items-center mt-3'>
                      <img className='h-10 w-10 rounded-full' src="/icon.png" alt={`${tag.user.username} profile picture`} />
                      <p className='ml-3'>{tag.user.username}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* feedError */}
            <div className={`${page == "feedError" ? "block" : "hidden"} flex items-center justify-center flex-col h-[90vh]`}>
              <svg width="200" height="83" viewBox="0 0 2000 824" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                  <path fillRule="evenodd" clipRule="evenodd" d="M1669.95 569.565H1736V506.768H1669.95V569.565ZM401.716 429.211H327.904V519.168H397.258C414.426 519.168 428.219 515.406 438.622 507.865C449.025 500.329 454.227 489.659 454.227 475.838C454.227 460.767 449.433 449.228 439.861 441.221C430.278 433.22 417.569 429.211 401.716 429.211ZM380.415 300.162H327.904V379.758H375.461C393.295 379.758 407.243 376.545 417.321 370.103C427.394 363.671 432.43 353.545 432.43 339.725C432.43 324.658 427.801 314.297 418.559 308.64C409.307 302.988 396.592 300.162 380.415 300.162ZM389.827 249.296C422.522 249.296 449.102 256.125 469.584 269.784C490.054 283.448 500.298 306.447 500.298 338.783C500.298 350.719 497.402 361.473 491.628 371.045C485.849 380.627 478.33 388.869 469.088 395.771C484.275 403.307 496.747 413.517 506.49 426.385C516.227 439.264 521.104 455.586 521.104 475.367C521.104 504.887 510.282 527.965 488.656 544.606C467.019 561.248 438.204 569.563 402.212 569.563H264V249.296H389.827ZM716.126 432.507C712.818 417.132 706.873 405.745 698.292 398.366C689.7 390.988 678.972 387.293 666.092 387.293C652.876 387.293 641.818 391.145 632.901 398.832C623.985 406.53 618.2 417.755 615.563 432.507H716.126ZM680.954 575.22C639.341 575.22 606.558 564.382 582.62 542.722C558.671 521.057 546.705 492.013 546.705 455.585C546.705 419.168 557.521 389.967 579.152 367.983C600.779 346.009 630.254 335.019 667.578 335.019C705.227 335.019 732.881 346.873 750.555 370.579C768.218 394.285 777.058 422.313 777.058 454.643V473.483H615.068C618.04 488.554 625.3 500.569 636.864 509.518C648.423 518.467 663.615 522.936 682.44 522.936C693.338 522.936 703.163 521.606 711.915 518.938C720.661 516.274 730.817 512.422 742.381 507.398L761.206 551.671C749.971 559.834 736.348 565.8 720.336 569.563C704.314 573.331 691.186 575.22 680.954 575.22ZM909.964 300.164H870.333V398.128H910.954C930.104 398.128 945.956 394.444 958.511 387.06C971.061 379.686 977.336 367.514 977.336 350.559C977.336 332.661 971.391 319.788 959.502 311.938C947.613 304.094 931.094 300.164 909.964 300.164ZM1002.11 569.565L930.77 447.11C927.131 447.424 923.339 447.659 919.376 447.816C915.413 447.978 911.45 448.052 907.487 448.052H870.333V569.565H806.429V249.298H911.945C948.603 249.298 979.972 257.305 1006.06 273.318C1032.16 289.331 1045.21 314.136 1045.21 347.733C1045.21 367.514 1039.83 384.548 1029.1 398.834C1018.36 413.121 1004.58 424.194 987.739 432.038L1070.47 569.565H1002.11ZM1231.56 432.507C1228.26 417.132 1222.31 405.745 1213.73 398.366C1205.13 390.988 1194.41 387.293 1181.53 387.293C1168.32 387.293 1157.25 391.145 1148.34 398.832C1139.42 406.53 1133.64 417.755 1131 432.507H1231.56ZM1196.39 575.22C1154.78 575.22 1122 564.382 1098.05 542.722C1074.11 521.057 1062.14 492.013 1062.14 455.585C1062.14 419.168 1072.95 389.967 1094.59 367.983C1116.22 346.009 1145.69 335.019 1183.02 335.019C1220.67 335.019 1248.32 346.873 1265.99 370.579C1283.66 394.285 1292.49 422.313 1292.49 454.643V473.483H1130.51C1133.48 488.554 1140.73 500.569 1152.3 509.518C1163.86 518.467 1179.05 522.936 1197.88 522.936C1208.77 522.936 1218.6 521.606 1227.35 518.938C1236.09 516.274 1246.26 512.422 1257.82 507.398L1276.64 551.671C1265.41 559.834 1251.79 565.8 1235.78 569.563C1219.75 573.331 1206.63 575.22 1196.39 575.22ZM1414.95 527.997C1444.17 527.997 1465.59 510.183 1465.59 486.43V470.103L1416.29 473.065C1391.08 474.551 1377.92 484.729 1377.92 500.852V501.276C1377.92 518.027 1392.42 527.997 1414.95 527.997ZM1313.45 504.453V504.034C1313.45 462.677 1347.13 438.494 1406.48 434.889L1465.59 431.498V417.504C1465.59 397.352 1451.75 384.839 1426.32 384.839C1402.01 384.839 1387.29 395.656 1384.17 410.288L1383.72 412.198H1324.16L1324.38 409.655C1327.95 367.659 1365.87 337.542 1429 337.542C1490.79 337.542 1530.72 367.874 1530.72 413.679V569.563H1465.59V535.632H1464.25C1450.64 558.961 1425.21 573.169 1393.75 573.169C1345.8 573.169 1313.45 544.538 1313.45 504.453ZM1566.18 569.565H1634.46V248.78H1566.18V569.565Z" fill="white" />
              </svg>
              <button onClick={() => {getFeed(token == null ? "error" : token); setLoading(true)}} className={`${loading ? "hidden" : "block"} mt-6 py-0.5 px-1.5 rounded-md border border-white border-opacity-50`}>Reesayer</button>
              <div className={`${loading ? "block" : "hidden"} mt-[26px] h-7 w-7 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`} role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
              </div>
            </div>

            {/* onePostFeed */}
            <div className={`${page == "onePostFeed" ? "block" : "hidden"} flex flex-col`}>
              <div className='flex flex-row mt-5 mx-5 justify-between'>
                <div className='' onClick={() => {setPage(selectedPost.from); window.scroll(0, feedScrollPos);}}>
                  <KeyboardBackspaceRoundedIcon className='h-10 w-10'/>
                </div>
                <div className='flex flex-col justify-center items-center'>
                  <h1 className='text-xl'>BeReal de {selectedPost.username}</h1>
                  <p className='opacity-60'>{UTCtoParis(selectedPost.takenAt)}{selectedPost.lateInSeconds !== 0 ? ` - ${formatTime(selectedPost.lateInSeconds)}` : ""}</p>
                </div>
                <div className='' onClick={() => {setPage("profile")}}>
                  <PersonRoundedIcon className='h-10 w-10'/>
                </div>
              </div>
              <div className='flex justify-center mt-6'>
                <div className='relative w-[40vw]' onClick={() => handleImageClick(selectedPost.id, 3)}>
                  <img
                    className="h-[26vh] w-[40vw] rounded-xl object-cover"
                    src={selectedImages[`${selectedPost.id}_${3}`] ? selectedPost.secondary.url : selectedPost.primary.url}
                    alt={`Image ${3}`}
                  />
                  <Draggable 
                    bounds="parent" 
                    onStart={() => {setSwipeable(true)}}
                    onStop={(e, data) => handleStopDrag(selectedPost.id, 3, data)}
                    defaultPosition={{x: 4, y: 0}}
                    position={{ x: 4, y: 0 }}
                  >
                  <img
                    className={`top-1 absolute w-11 h-14 rounded-lg border border-black object-cover ${swipeable ? "" : "transition-transform duration-500"}`}
                    src={selectedImages[`${selectedPost.id}_${3}`] ? selectedPost.primary.url : selectedPost.secondary.url}
                    alt={`Image ${3}`}
                  />
                  </Draggable>
                </div>
              </div>
              <div className='flex items-center w-full justify-center'>
                <div className={`${selectedPost.location.longitude !== 180 ? "block" : "hidden"} mx-2 bg-zinc-800 flex w-[142px] mt-5 rounded-full text-white`}>
                  <NearMeIcon className='text-white p-1'/>
                  <a
                    className='text-sm opacity-60 cursor-pointer'
                    target="_blank"
                    rel="noopener noreferrer"
                    href={selectedPost.location ? `https://www.google.com/maps/?q=${selectedPost.location.latitude},${selectedPost.location.longitude}` : undefined}
                    onClick={(e) => {
                      if (!selectedPost.location) {
                        e.preventDefault();
                      }
                    }}
                  >
                    ouvrir dans maps
                  </a>
                </div>
                <div className={`${selectedPost.retakeCounter > 0 ? selectedPost.retakeCounter > 1 ? "block w-[95px]" : "block w-[87px]" : "hidden"} mx-2 bg-zinc-800 flex mt-5 rounded-full text-white`}>
                  <ScreenRotationAltIcon className='p-1'/>
                  <p className='text-sm opacity-60 cursor-pointer'>{selectedPost.retakeCounter > 1 ? `${selectedPost.retakeCounter} reprises` : `${selectedPost.retakeCounter} reprise`}</p>
                </div>
              </div>
              <span className='mt-5 mb-3 h-[1px] bg-white opacity-20'/>
              <div className=" overflow-x-clip">
                <div className="flex flex-nowrap overflow-auto pb-2">
                  {selectedPost.realMojis.map((item, index) => (
                    <div key={index} className="flex flex-col items-center -mr-2">
                      <img src={item.media.url} alt={`Image ${index}`} className="w-16 h-16 rounded-full" />
                      <div className="text-right ml-16 -mt-8 text-3xl">{item.emoji}</div>
                      <div className="text-center mb-1 text-xs">{item.user.username}</div>
                    </div>
                  ))}
                </div>
              </div>
              <span className='h-[1px] bg-white opacity-20'/>
              <div>
                {selectedPost.comments.map((comment) => (
                  <div className='flex mt-3 mb-5 ml-2'>
                    <img src={JSON.stringify(comment.user.profilePicture) == "null" ? "/icon.png" : comment.user.profilePicture.url} alt={`${comment.user.username}'s profile`} className='w-9 h-9 rounded-full'/>
                    <div className='flex flex-col ml-2'>
                      <div className='flex flex-row text-sm'>
                        <p>{comment.user.username}</p>
                        <p className='ml-2 opacity-60'>{UTCtoParis(comment.postedAt)}</p>
                      </div>
                      <p>{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          
            {/* fof */}
            <div className={`${page == "fof" ? `block pt-11` : "hidden"} pb-11`}>
            <div className={`${feed.data.data.userPosts ? isScrolled ? "block" : "hidden" : "hidden"} z-50`}>
                <div className='flex text-white justify-center mt-2 fixed w-full z-50'>
                  <div className={`${loading ? "block" : "hidden"} mt-1 mr-3 h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`} role="status">
                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                  </div>
                  <p className={`mr-2 opacity-50 ${loading ? "hidden" : "block"}`} onClick={() => {getFeed(token == null ? "error" : token); setLoading(true)}}>Mes Amis</p>
                  <p className='ml-2'>Amis d'Amis</p>
                </div>
              </div>
            <div className="flex flex-col-reverse">
                {FOFfeed && FOFfeed.data.map((post, imageIndex) => (
                  <div className="mt-20 overflow-visible" key={post.user.id}>
                      <div className='flex flex-col' key={`${post.id}_${imageIndex}`}>
                        <div className='flex mb-1.5'>
                          <img className='w-9 h-9 rounded-full' src={JSON.stringify(post.user.profilePicture) == undefined ? "/icon.png" : post.user.profilePicture.url} alt={`${post.user.username}'s profile`} />
                          <div className='flex-col ml-2'>
                            <div className='h-4 flex'>{post.user.username}{post.tags.map((tag, tagIndex) => (<p>{tag.user.username}{tagIndex+1 == post.tags.length ? "" : ","}</p>))}</div>
                            <a
                              className='text-sm opacity-60 cursor-pointer'
                              target="_blank"
                              rel="noopener noreferrer"
                              href={post.location ? `https://www.google.com/maps/?q=${post.location.latitude},${post.location.longitude}` : undefined}
                              onClick={(e) => {
                                if (!post.location) {
                                  e.preventDefault();
                                }
                              }}
                            >
                              {post.location ? `ouvrir dans maps • ` : ""}
                              {post.lateInSeconds !== 0 ? formatTime(post.lateInSeconds) : UTCtoParis(post.takenAt)}
                            </a>
                          </div>
                        </div>
                        <div className='relative' onClick={() => handleImageClick(post.id, imageIndex)}>
                          <img
                            className="h-[65vh] w-full rounded-3xl object-cover"
                            src={selectedImages[`${post.id}_${imageIndex}`] ? post.secondary.url : post.primary.url}
                            alt={`Image ${imageIndex}`}
                          />
                          <Draggable 
                            bounds="parent" 
                            onStart={() => {setSwipeable(true)}}
                            onStop={(e, data) => handleStopDrag(post.id, imageIndex, data)}
                            defaultPosition={{x: 12, y: 0}}
                            position={posImages[`${post.id}_${imageIndex}`] || { x: 12, y: 0 }}
                          >
                            <img
                              className={`top-3 absolute w-28 h-36 rounded-xl border-2 border-black object-cover ${swipeable ? "" : "transition-transform duration-500"}`}
                              src={selectedImages[`${post.id}_${imageIndex}`] ? post.primary.url : post.secondary.url}
                              alt={`Image ${imageIndex}`}
                            />
                          </Draggable>
                        </div>
                        <div className={`flex ml-7 -mt-14 ${post.realmojis.sample[0] ? "mb-0" : "mb-10"} z-50`} onClick={() => {
                          setSelectedPost({
                            "from": "fof",
                            "username": post.user.username,
                            "profilePicture": post.user.profilePicture ? post.user.profilePicture.url : "/icon.png",
                            "primary": post.primary,
                            "secondary": post.secondary,
                            "realMojis": post.realmojis.sample,
                            "lateInSeconds": post.lateInSeconds,
                            "takenAt": post.takenAt,
                            "location": post.location || {"latitude": 180, "longitude": 180},
                            "comments": [],
                            "tags": post.tags,
                            "retakeCounter": 0,
                            "id": post.id
                          });
                          setFeedScrollPos(window.scrollY);
                          setPage("onePostFeed")
                        }}>
                          {post.realmojis.sample.slice(0, 3).map((realMojis, index) => (
                            <div className='flex flex-row -ml-2.5' key={`${post.id}_realMojis_${index}`}>
                              <img
                                className={`w-8 h-8 rounded-full border border-black `}
                                src={realMojis.media.url}
                                alt={`Realmoji ${index + 1}`}
                              />
                              {index === 2 && post.realmojis.sample.length > 3 && (
                                <div className={`absolute flex items-center justify-center text-white text-sm h-8 w-8 rounded-full bg-black bg-opacity-70`}>
                                  {post.realmojis.sample.length > 4 ? "3+" : "+2" }
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        {post.caption ? <p className='ml-2 mt-8'>{post.caption}</p> : ""}
                        <div className='ml-2 opacity-50' onClick={() => {
                          setSelectedPost({
                            "from": "fof",
                            "username": post.user.username,
                            "profilePicture": post.user.profilePicture ? post.user.profilePicture.url : "/icon.png",
                            "primary": post.primary,
                            "secondary": post.secondary,
                            "realMojis": post.realmojis.sample,
                            "lateInSeconds": post.lateInSeconds,
                            "takenAt": post.takenAt,
                            "location": post.location || {"latitude": 180, "longitude": 180},
                            "comments": [],
                            "tags": post.tags,
                            "retakeCounter": 0,
                            "id": post.id
                          });
                          setFeedScrollPos(window.scrollY);
                          setPage("onePostFeed")
                        }}>
                        </div>
                      </div>
                  </div>
                )).reverse()}
              </div>
            </div>
        </div>
        </>
    )
}
export default Home;