package Model.Minor

object Streamers_ {
	import spray.json.DefaultJsonProtocol
	case class Streamers(
		                    streamers : List[String]
	                    )


	trait MonthsJsonProtocol extends DefaultJsonProtocol{
		implicit val MonthsJson = jsonFormat1(Streamers)
	}
}
