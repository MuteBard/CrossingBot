name := "CBAS"

version := "0.1"

scalaVersion := "2.12.7"
lazy val akkaVersion = "2.6.1"
lazy val akkaHttpVersion = "10.1.11"
lazy val leveldbVersion = "0.7"
lazy val leveldbjniVersion = "1.8"
val mongodbVersion = "1.1.2"

//mongoDB dependencies
val akkaStreamVersion = "2.5.23"
val mongoDriverReactiveStreamsVersion = "1.11.0"
val scalaLibraryVersion = "2.12.7"

libraryDependencies ++= Seq(
"com.typesafe.akka" %% "akka-stream" % akkaVersion,
"com.typesafe.akka" %% "akka-http" % akkaHttpVersion,
"com.typesafe.akka" %% "akka-http-spray-json" % akkaHttpVersion,
"com.typesafe.akka" %% "akka-http-testkit" % akkaHttpVersion,
"com.typesafe.akka" %% "akka-stream" % akkaStreamVersion,
"org.mongodb" % "mongodb-driver-reactivestreams" % mongoDriverReactiveStreamsVersion,
"org.scala-lang" % "scala-library" % scalaLibraryVersion,
"com.lightbend.akka" %% "akka-stream-alpakka-mongodb" % mongodbVersion
)