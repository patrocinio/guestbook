<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

require 'Predis/Autoloader.php';

Predis\Autoloader::register();

function retrieveMessages () {
  $host = 'redis-slave';
  if (getenv('GET_HOSTS_FROM') == 'env') {
    $host = getenv('REDIS_SLAVE_SERVICE_HOST');
  }
  $client = new Predis\Client([
    'scheme' => 'tcp',
    'host'   => $host,
    'port'   => 6379,
  ]);

  $value = $client->get($_GET['key']);

   return $value
}

function appendMessage () {
  $host = 'redis-master';
  if (getenv('GET_HOSTS_FROM') == 'env') {
    $host = getenv('REDIS_MASTER_SERVICE_HOST');
  }

  $client = new Predis\Client([
    'scheme' => 'tcp',
    'host'   => $host,
    'port'   => 6379,
  ]);

  $value .= ",".$_GET['value'];

  $client->set($_GET['key'], $value);
}

if (isset($_GET['cmd']) === true) {
  $value = retrieveMessages;

  if ($_GET['cmd'] == 'append') {
    appendMessage();
  }
  header('Content-Type: application/json');
  print('{"data": "' . $value . '"}');
} else {
  phpinfo();
} ?>
