package Model.Major
import Data.Market.MarketHourBlock.{HourBlock, HourBlockJsonProtocol}
import Data.Market.MarketQuarterBlock.{QuarterBlock, QuarterBlockJsonProtocol}

object MovementRecord_ {
	import spray.json.DefaultJsonProtocol
	case class MovementRecord(
		                         _id : String,
		                         hourBlockId : Int,
		                         quarterBlockId : Int,
		                         todayHigh: Int,
		                         todayLow : Int,
		                         hourBlockName : String,
		                         latestHourBlock : HourBlock,
		                         latestQuarterBlock : QuarterBlock,
		                         quarterBlockHistory : List[QuarterBlock],
		                         latestTurnipPrice : Int,
		                         turnipPriceHistory : List[Int],
		                         month : Int,
		                         day : Int,


	)

	trait MovementRecordJsonProtocol extends DefaultJsonProtocol with HourBlockJsonProtocol with QuarterBlockJsonProtocol{
		implicit val StalkJson = jsonFormat13(MovementRecord)
	}
}
