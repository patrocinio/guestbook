<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

require 'Predis/Autoloader.php';

Predis\Autoloader::register();

if (isset($_GET['cmd']) === true) {
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
  $value = "Banana";

  $host = 'redis-master';
  if (getenv('GET_HOSTS_FROM') == 'env') {
    $host = getenv('REDIS_MASTER_SERVICE_HOST');
  }
  header('Content-Type: application/json');
  if ($_GET['cmd'] == 'append') {
    $client = new Predis\Client([
      'scheme' => 'tcp',
      'host'   => $host,
      'port'   => 6379,
    ]);

    $value .= ",".$_GET['value'];

    $client->set($_GET['key'], $value);
  }
  print('{"data": "' . $value . '"}');
} else {
  phpinfo();
} ?>
