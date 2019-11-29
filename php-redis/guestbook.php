<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

require 'Predis/Autoloader.php';

Predis\Autoloader::register();

function getRedisMaster () {
  $host = 'redis-master';
  if (getenv('GET_HOSTS_FROM') == 'env') {
    $host = getenv('REDIS_MASTER_SERVICE_HOST');
  }

  return $host;
}

function getRedisSlave() {
  $host = 'redis-slave';
  if (getenv('GET_HOSTS_FROM') == 'env') {
    $host = getenv('REDIS_SLAVE_SERVICE_HOST');
  }

  return $host;
}

function connectToRedis($host) {
  $client = new Predis\Client([
    'scheme' => 'tcp',
    'host'   => $host,
    'port'   => 6379,
  ]);

  return $client;
}

function retrieveMessages () {
  $host = getRedisSlave();
  $client = connectToRedis($host);

  $value = $client->get($_GET['key']);

   return $value;
}

function appendMessage ($messages) {
  $host = getRedisMaster();
  $client = connectToRedis ($host);

  $value = $messages . ",".$_GET['value'];

  $client->set($_GET['key'], $value);

  return $value;
}

function clearMessages () {
  $host = getRedisMaster();
  $client = connectToRedis ($host);

  $client->del($_GET['key']);
}

if (isset($_GET['cmd']) === true) {
  $value = retrieveMessages();

  if ($_GET['cmd'] == 'append') {
    $value = appendMessage($value);
  }

  if ($_GET['cmd'] == 'clear') {
    clearMessages();
    $values = "";
  }


  header('Content-Type: application/json');
  print('{"data": "' . $value . '"}');
} else {
  phpinfo();
} ?>
