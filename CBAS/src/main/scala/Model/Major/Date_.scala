package Model.Major

object Date_ {
	import spray.json.DefaultJsonProtocol
	case class Date(year : Int,
	                month : Int,
	                day: Int,
	                hour: Int,
	                minute: Int,
	                second: Int
	               )
	trait DateJsonProtocol extends DefaultJsonProtocol{
		implicit val DateJson = jsonFormat6(Date)
	}

}
