import cv2
import sched, time
import numpy as np
import threading
import fileinput

cam = cv2.VideoCapture(1)
def get_coordinates(event, x, y, flags, param):
    if event == cv2.EVENT_LBUTTONDOWN:
        print x, y
cv2.namedWindow('image')
cv2.setMouseCallback('image', get_coordinates)
def send_picture(): 
    print "Doing stuff..."
    ret, frame = cam.read()
    try:
        print frame.shape 
        cv2.imshow('image', frame)
        k = cv2.waitKey(1)
    except:
        pass
    finally:
        threading.Timer(0.1, send_picture).start()
    '''
    if not ret:
#        break
        pass 
    k = cv2.waitKey(1)
    
    if k%256 == 27:
        # ESC pressed
        #print("Escape hit, closing...")
#        break
        pass
    elif k%256 == 32:
        # SPACE pressed
        #img_name = "opencv_frame_{}.jpg".format(img_counter)
        #cv2.imwrite(img_name, frame)
        #print("{} written!".format(img_name))
        pass
    # do your stuff
    '''

send_picture()

for line in fileinput.input():
    pass
cam.release()

cv2.destroyAllWindows()
