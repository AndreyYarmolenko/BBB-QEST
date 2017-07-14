<?php
include_once "../settings.php";
/*$arrUsers =array();

function getUsersId($arr_boss_id, $users_name){
		global $arrUsers;
		global $db;
		$tempArr = array();
		$where = "";
		
		if(!empty($arr_boss_id))
		{
			
			for($i=0;$i<count($arr_boss_id);$i++){
				
				if(!empty($users_name)){
					$where = "AND `name` LIKE'%".$users_name[$i]."%'";
				}
				
				$query = "SELECT `id` FROM `bb_users` WHERE `boss_id` = ".$arr_boss_id[$i]." ".$where.";";
				//echo $query;
				if($stmt = $db->prepare($query)){
					if($stmt->execute()){
						$stmt->bind_result($id);

						while($stmt->fetch()){
							array_push($tempArr, $id);
							array_push($arrUsers, $id);
						}
						$stmt->close();

						getUsersId($tempArr, $arrUsers);
					}
				}
				$i++;	
			}
		}else{
			return;
		}
		
}*/

function getLocale(){
	
	define('root_lang', './lang/');
	define('lang_name', $_SESSION['m_locale']);
	
	//echo root_lang .lang_name .".json";
	
	try{
		$lang_json = file_get_contents(root_lang."".lang_name.".json", true);
		$lang_object = json_decode($lang_json,true);
		return $lang_object;
	}catch(Exception $e){
		die($e);
	}
	
	

}

function getUsersIdByBossId2($bossidArray, $usersTemp=array(), $count = 0){
	global $db;
	
	$tempBossidArray = array();
	$bossidArray = (array) $bossidArray;
	

	//foreach($bossidArray as $key=>$value){
	$str_boss = implode(',', $bossidArray);	

		//$query = "SELECT `id`  FROM `bb_users` WHERE `boss_id` = ".$value." ORDER BY `id` ASC;";
		$query = "SELECT `id`  FROM `bb_users` WHERE `boss_id` IN (".$str_boss.") ORDER BY `id` ASC;";
		
		if ($stmt = $db->prepare($query)) {
			if ($stmt->execute()) {
				$stmt->bind_result($id);
				$stmt->store_result();
				if($stmt->num_rows()>0){
					while($stmt->fetch()){
						//if ($id !== 1){
							$tempBossidArray[] = $id;
							$usersTemp[]= $id;
						//}
					}
				}
				$stmt->close();
			}
		}

	//}

	if(count($tempBossidArray)>$count){
		$count = count($tempBossidArray);
		return getUsersIdByBossId2($tempBossidArray, $usersTemp, $count);
	}else{
		return $usersTemp;
	}
}

?>