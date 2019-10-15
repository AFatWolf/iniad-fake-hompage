Course file format:
{  
    "lecture": [  // a course can have many topic
        {   // E.g.: Introduction to python
            "name": "name_of_1st_topic",
            "name_of_1st_topic": [  
                {  // means 1.1
                    "part": 1,  
                    "section": 1,
                    "name": "name_of_the_lecture",
                    "video_link": "link_to_the_lecture_video",
                    // lecture[0][name][0]
                    "code": "0,0",
                    "note": [
                        {
                            "user_id": user_id,
                            "thumbsUp": number_of_thumbs_up
                        },
                        {
                            "user_id_2": user_id_2,
                            "thumbsUp_2": number_of_thumbs_up
                        }
                    ]
                },
                { // means 1.2
                    "part": 1,
                    "section": 2,
                    "name": "name_of_the_lecture",
                    "video_link": "link_to_the_lecture_video",
                    "code": "0,1"
                }
            ]
        },
        {
            "name": "name_of_2nd_topic",
            "name_of_2nd_topic": [  
                {  // means 2.1
                    "part": 2,  
                    // -1 means no section 2, meaning no 2.2
                    "section": -1,
                    "name": "name_of_the_lecture",
                    "video_link": "link_to_the_lecture_video",
                    "code": "1,1"
                },
                { // means 2.2
                    "part": 2,
                    "section": 2,
                    "name": "name_of_the_lecture",
                    "video_link": "link_to_the_lecture_video",
                    "code": "1,2"
                }
            ]
        }
    ]
}