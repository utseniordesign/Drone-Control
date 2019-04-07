import yellow
import sched, time
from multiprocessing.pool import ThreadPool

#just prints detected
def do_something(sc):
    print yellow.detected, "\n"
    # do your stuff
    s.enter(1, 1, do_something, (sc,))

# run image processing script 
def main():
    print "connected"
    pool = ThreadPool(processes=1)
    async_result = pool.apply_async(yellow.getCameraFeed) # tuple of args for foo
    # do some other stuff in the main process
#    global s
    '''
    s = sched.scheduler(time.time, time.sleep)
    s.enter(1, 1, do_something, (s,))
    s.run()
    return_val = async_result.get()  # get the return value from getCameraFeed.
    '''
if __name__ =='__main__' :
    main = main()
    print yellow.detected
    
    while True:
        time.sleep(1)
        if yellow.detected:
            print True
            break
        
