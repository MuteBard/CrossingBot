package Helper

import java.util.Calendar
object Auxiliary {

	def date() = {
		val dt = Calendar.getInstance()
		val month = if (dt.get(Calendar.MONTH) < 10) "0"+(dt.get(Calendar.MONTH)+1) else dt.get(Calendar.HOUR)+1
		val day = dt.get(Calendar.DAY_OF_MONTH)
		val year = dt.get(Calendar.YEAR)
		val hour = if (dt.get(Calendar.HOUR) < 10) "0"+dt.get(Calendar.HOUR) else dt.get(Calendar.HOUR)
		val minute = if (dt.get(Calendar.MINUTE) < 10) "0"+dt.get(Calendar.MINUTE) else dt.get(Calendar.MINUTE)
		val second = if (dt.get(Calendar.SECOND) < 10) "0"+dt.get(Calendar.SECOND) else dt.get(Calendar.SECOND)
		val millisecond = dt.get(Calendar.MILLISECOND)
		s"$month/$day/$year $hour:$minute:$second:$millisecond"
	}

	object log {
		def info(className : String, message : String): Unit = {
			println(s"[INFO] [${date()}] [$className] $message")
		}
		def info(className : String, method: String, message : String): Unit = {
			println(s"[INFO] [${date()}] [$className] [$method] $message")
		}
		def info(className : String, method: String, status: String, message : String): Unit = {
			println(s"[INFO] [${date()}] [$className] [$method] [$status] $message")
		}


		def warn(className : String, message : String) : Unit = {
			println(s"[WARN] [${date()}] [$className] $message")
		}
		def warn(className : String, method: String, message : String): Unit = {
			println(s"[INFO] [${date()}] [$className] [$method] $message")
		}
		def warn(className : String, method: String, status: String, message : String): Unit = {
			println(s"[INFO] [${date()}] [$className] [$method] [$status] $message")
		}
	}






	def log(loglevel : String, className : String, path : String, message : String) : String = {
		val dt = Calendar.getInstance()
		val month = dt.get(Calendar.MONTH)
		val day = dt.get(Calendar.DAY_OF_MONTH)
		val year = dt.get(Calendar.YEAR)
		val hour = dt.get(Calendar.HOUR)
		val minute = dt.get(Calendar.MINUTE)
		val second = dt.get(Calendar.SECOND)
		val millisecond = dt.get(Calendar.MILLISECOND)
		s"[$loglevel][$className][$month/$day/$year $hour:$minute:$second:$millisecond]"
	}


}


