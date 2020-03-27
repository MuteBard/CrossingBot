package Model.Minor

object Selling_ {
	import spray.json.DefaultJsonProtocol
	case class Selling(
		                username : String = "",
		                creature : String = "",
		                species : String = ""
	                 )

	trait SellingJsonProtocol extends DefaultJsonProtocol{
		implicit val SellingJson = jsonFormat3(Selling)
	}
}
