package Model.Minor

object CreatureSell_ {
	import spray.json.DefaultJsonProtocol
	case class CreatureSell(
		                username : String = "",
		                creature : String = "",
		                species : String = ""
	                 )

	trait CreatureSellJsonProtocol extends DefaultJsonProtocol{
		implicit val creatureSellJson = jsonFormat3(CreatureSell)
	}
}
