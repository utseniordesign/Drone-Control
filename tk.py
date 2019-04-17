#!/usr/bin/env python
import rospy

from geometry_msgs.msg import Twist
from std_msgs.msg import String
from std_msgs.msg import Empty
from ardrone_autonomy.msg import Navdata

#image processing
import DroneDetect
from multiprocessing.pool import ThreadPool

def takeoff():
        pubt = rospy.Publisher("ardrone/takeoff", Empty, queue_size=10 )
	for x in range (1, 10):
		pubt.publish(Empty())
        	rate.sleep()
def land():
	publ = rospy.Publisher("ardrone/land", Empty, queue_size=10 )
	for x in range (1, 10):
        	publ.publish(Empty())
        	rate.sleep()
	
def hover():
        hov_pub = rospy.Publisher("cmd_vel",Twist, queue_size=10)
        twist = Twist()
        twist.linear.x = 0;
        twist.linear.y = 0;
        twist.linear.z = 0;
        twist.angular.x = 1;
        twist.angular.y = 1;
        twist.angular.z = 0;
        for x in range (1, 50):
		hov_pub.publish(twist)
		rate.sleep()

def set_cmd(linear_x, linear_y, linear_z, angular_x, angular_y, angular_z):
        cmd_pub = rospy.Publisher("cmd_vel", Twist, queue_size=10)
        twist = Twist()
        twist.linear.x = linear_x;
        twist.linear.y = linear_y;
        twist.linear.z = linear_z;
        twist.angular.x = angular_x;
        twist.angular.y = angular_y;
        twist.angular.z = angular_z;
        for x in range (1, 30):
                cmd_pub.publish(twist)
                rate.sleep()

if __name__ == '__main__':

	#initialize image processing background process
        pool = ThreadPool(processes=1)
	async_result = pool.apply_async(DroneDetect.getCameraFeed)
	try:
		rospy.init_node('control', anonymous=True)
		rate = rospy.Rate(10)
		prevX = 0
		prevY = 0
		prevZ = 0
		for line in open('route.txt'):
			line = line.rstrip('\n')
			x, y, z = line.split(' ')
			diffX, diffY, diffZ = 0;
			if x is not prevX:#velocity
				diffX = prevX - x
				prevX = x
			if y is not prevY:#velocity
				diffY = prevY - y
				prevY = y
			if z is not prevZ:
				diffZ = prevZ - z
				#takeoff
				prevZ = z
				if prevZ is 0 and z is 5:
					takeoff()
					continue
			
		while not DroneDetect.detected:#something is detected	
			hover()
		print "detected obstacle"
		land()
        except rospy.ROSInterruptException:
		pass

