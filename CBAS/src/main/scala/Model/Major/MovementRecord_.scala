package Model.Major

import Model.Major.Date_.{Date, DateJsonProtocol}
import Data.Market.MarketHourBlock.{HourBlock, HourJsonProtocolQuarter}
import Data.Market.MarketQuarterBlock.{QuarterBlock, QuarterBlockJsonProtocol}

object MovementRecord_ {
	import spray.json.DefaultJsonProtocol
	case class MovementRecord(
		                         _id : String,
		                         hourBlockId : Int,
		                         quarterBlockId : Int,
		                         todayHigh: Int,
		                         todayLow : Int,
		                         latestHourBlock : HourBlock,
		                         hourBlockHistory : List[HourBlock],
		                         latestQuarterBlock : QuarterBlock,
		                         quarterBlockHistory : List[QuarterBlock],
		                         month : Int,
		                         day : Int,
		                         turnipPrice : Int,

	)

	trait MovementRecordJsonProtocol extends DefaultJsonProtocol with HourJsonProtocolQuarter with QuarterBlockJsonProtocol with DateJsonProtocol{
		implicit val StalkJson = jsonFormat12(MovementRecord)
	}
}
