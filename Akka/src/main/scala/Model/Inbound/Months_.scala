package Model.Inbound

object Months_ {
	import spray.json.DefaultJsonProtocol
	case class Months(
		                availability : List[String]
	                 )


	trait MonthsJsonProtocol extends DefaultJsonProtocol{
		implicit val MonthsJson = jsonFormat1(Months)
	}
}
