package Model.Major

import Model.Major.Bug_.{Bug, BugJsonProtocol}
import Model.Major.Fish_.{Fish, FishJsonProtocol}

object Pocket_ {
	import spray.json.DefaultJsonProtocol
	case class Pocket(
		bug : List[Bug] = List(),
		fish : List[Fish] = List()
	)

	trait PocketJsonProtocol extends DefaultJsonProtocol with BugJsonProtocol with FishJsonProtocol{
		implicit val PocketJson = jsonFormat2(Pocket)
	}
}
