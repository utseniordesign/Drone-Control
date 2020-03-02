#importing Modules

import cv2
import numpy as np

#Capturing Video through webcam.
detected = False
def getCameraFeed():
    cap = cv2.VideoCapture(1)
    while(1):
            _, img = cap.read()

            #converting frame(img) from BGR (Blue-Green-Red) to HSV (hue-saturation-value)

            hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        
            #defining the range of Yellow color for rogue drone
            #yellow_lower = np.array([22,60,200],np.uint8)
            #yellow_lower = np.array([22,60,100],np.uint8)
            #yellow_upper = np.array([60,255,255],np.uint8)
            yellow_lower = np.array([40,50,50],np.uint8)
            yellow_upper = np.array([80,255,255],np.uint8)

            #define the range of blue color for in system drone
            blue_lower = np.array([110,50,50],np.uint8)
            blue_upper = np.array([130,255,255],np.uint8)
            #blue_upper = np.array([130,155,155],np.uint8)
            #blue_lower = np.array([0,50,50],np.uint8)#actually red
            #blue_upper = np.array([20,255,255],np.uint8)#actually red

            #finding the range yellow colour in the image
            yellow = cv2.inRange(hsv, yellow_lower, yellow_upper)

            #finding the range yellow colour in the image
            blue_drone = cv2.inRange(hsv, blue_lower, blue_upper)
            
            #Morphological transformation, Dilation         
            kernal = np.ones((5 ,5), "uint8")

            blue=cv2.dilate(yellow, kernal)
            blue2=cv2.dilate(blue_drone, kernal)

            res=cv2.bitwise_and(img, img, mask = yellow)
            res2=cv2.bitwise_and(img, img, mask = blue_drone)

            #Tracking Colour (Yellow) 
            (_,contours,hierarchy)=cv2.findContours(yellow,cv2.RETR_TREE,cv2.CHAIN_APPROX_SIMPLE)
            (_,contours2,hierarchy2)=cv2.findContours(blue_drone,cv2.RETR_TREE,cv2.CHAIN_APPROX_SIMPLE)
        
            for pic, contour in enumerate(contours):
                area = cv2.contourArea(contour)
                if(area>300):
                    x,y,w,h = cv2.boundingRect(contour)     
                    img = cv2.rectangle(img,(x,y),(x+w,y+h),(255,0,0),3)
                    global detected
                    detected = True        
            for pic, contour in enumerate(contours2):
                area = cv2.contourArea(contour)
                if(area>300):
                    x,y,w,h = cv2.boundingRect(contour)     
                    img = cv2.rectangle(img,(x,y),(x+w,y+h),(255,0,0),3)
                    global detected
                    detected = True        
            cv2.imshow("Color Tracking",img)
            img = cv2.flip(img,1)
            cv2.imshow("Yellow",res)
            cv2.imshow("Blue",res2)
                               
            if cv2.waitKey(10) & 0xFF == 27:
                cap.release()
                cv2.destroyAllWindows()
                break
