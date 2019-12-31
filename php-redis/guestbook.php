<?php

function logMessage($message) {
  $out = fopen('php://output', 'w');
  fputs($out, $message);
  fclose($out);
}

function connectToMongo() {
  logMessage("Connecting to MongoDB...");
  $client = new MongoDB\Client('mongodb+srv://admin:password@mongodb/messages');
}

function getLock($client) {
  $factory = new RedisSimpleLockFactory($client);
  return $factory;
}

function retrieveMessages () {
  $host = getRedisSlave();
  $client = connectToRedis($host);

  $value = $client->get($_GET['key']);

   return $value;
}

function appendMessage ($master, $messages) {
//  sleep(1);

  $value = $messages . ",".$_GET['value'];

  $client->set($_GET['key'], $value);

  return $value;
}

function clearMessages () {
  $client = connectToMongo ();

  $client->del($_GET['key']);
}

if (isset($_GET['cmd']) === true) {
  $master = connectToMongo ();

  $lock = getLock ($master);
  $lock->acquire();

  $value = retrieveMessages();

  if ($_GET['cmd'] == 'append') {
    $value = appendMessage($value);
  }

  if ($_GET['cmd'] == 'clear') {
    clearMessages();
    $values = "";
  }

  $lock->release();

  header('Content-Type: application/json');
  print('{"data": "' . $value . '"}');
} else {
  phpinfo();
} ?>
