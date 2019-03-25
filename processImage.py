import cv2
import sched, time
import numpy as np
import threading
import fileinput
from skimage.measure import compare_ssim
import imutils

cam = cv2.VideoCapture(1)
def get_coordinates(event, x, y, flags, param):
    if event == cv2.EVENT_LBUTTONDOWN:
        print x, y
cv2.namedWindow('image')
cv2.setMouseCallback('image', get_coordinates)
def send_picture(imageA): 
    print "Doing stuff..."
    imageB = imageA
    ret, imageA = cam.read()
    #try:
    grayA = cv2.cvtColor(imageA, cv2.COLOR_BGR2GRAY)
    grayB = cv2.cvtColor(imageB, cv2.COLOR_BGR2GRAY)
    #cv2.imshow('image', grayA)
        # compute the Structural Similarity Index (SSIM) between the two
        # images, ensuring that the difference image is returned
    (score, diff) = compare_ssim(grayA, grayB, full=True)
    diff = (diff * 255).astype("uint8")

#        print "SSIM: {}".format(score)
        # threshold the difference image, followed by finding contours to
        # obtain the regions of the two input images that differ
    thresh = cv2.threshold(diff, 0, 255, cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)[1]
    cnts = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnts = imutils.grab_contours(cnts)
    
    k = cv2.waitKey(1)
    threading.Timer(0.2, send_picture, [imageA]).start()
    # loop over the contours
    for c in cnts:
	# compute the bounding box of the contour and then draw the
	# bounding box on both input images to represent where the two
	# images differ
        (x, y, w, h) = cv2.boundingRect(c)
        if w < 50 and h < 50:
            continue
	cv2.rectangle(imageA, (x, y), (x + w, y + h), (0, 0, 255), 2)
	cv2.rectangle(imageB, (x, y), (x + w, y + h), (0, 0, 255), 2)
    cv2.imshow('image', diff)
    #cv2.imshow('image', frame)
    #        cv2.imshow('image', diff)
    #except:
    #    pass
    #finally:
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

ret, imageA = cam.read()
send_picture(imageA)

for line in fileinput.input():
    pass
cam.release()

cv2.destroyAllWindows()
