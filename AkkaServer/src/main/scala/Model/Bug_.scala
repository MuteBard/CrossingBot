package Model

object Bug_ {
	import spray.json.DefaultJsonProtocol
	case class Bug(
		_id : Int,
		bugId : String,
		name : String,
		bells : Int,
		availability : List[String],
		rarity : Int,
		img : String
	)

	trait BugJsonProtocol extends DefaultJsonProtocol{
		implicit val BugJson = jsonFormat7(Bug)
	}
}



