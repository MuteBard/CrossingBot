package Model.Minor
import Model.Major.Bug_.Bug

object AddingBug_ {
	import spray.json.DefaultJsonProtocol
	case class AddingBug(
		username : String,
		bug : Bug
	)

	trait AddingBugJsonProtocol extends DefaultJsonProtocol{
		implicit val BugJson = jsonFormat7(Bug)
		implicit val AddingBugJson = jsonFormat2(AddingBug)
	}
}
