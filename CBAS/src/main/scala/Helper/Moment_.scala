package Helper

object Moment_ {
	case class Moment(
		               hour : Int,
		               minutes : Int,
		               block : Int = 0
	               ){
		def convert(): Moment = {
			val quad1 = 0 to 14
			val quad2 = 15 to 29
			val quad3 = 30 to 44
			val quad4 = 45 to 59
			if(hour > 23) throw new IndexOutOfBoundsException("Hours must be between 0 - 23")
			if(quad1.contains(minutes)) Moment(hour,minutes)
			else if(quad2.contains(minutes)) Moment(hour,minutes,1)
			else if(quad3.contains(minutes)) Moment(hour,minutes,2)
			else if(quad4.contains(minutes)) Moment(hour,minutes,3)
			else throw new IndexOutOfBoundsException("Minutes must be between 0 - 59")
		}
	}
}
