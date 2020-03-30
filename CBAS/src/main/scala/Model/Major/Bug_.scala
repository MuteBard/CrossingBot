package Model.Major

object Bug_ {
	import spray.json.DefaultJsonProtocol
	case class Bug(
		_id : Int = 0,
		bugId : String = "",
		name : String = "NULL/BUG",
		bells : Int = 0,
		availability : List[String] = List(),
		rarity : Int = 0,
		img : String = ""
	)

	trait BugJsonProtocol extends DefaultJsonProtocol{
		implicit val BugJson = jsonFormat7(Bug)
	}
}
