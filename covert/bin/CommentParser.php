<?php
class CommentParser {
    private $params = array ();
    /**
     * 设置为数组的参数集合
     * @var array
     */
    public $params_array_keys=array('param');
    /**
     * 快解析的参数集合
     * @var array
     */
    public $params_parse_block=array('examples');//块状解析参数

    /**
     *  解析注释
     * @param string $doc 注释
     * @return array
     */
    public  function parse($doc = '') {
        if ($doc == '') {
            return $this->params;
        }
        # 匹配出完整注释
        if (preg_match ( '#^/\*\*(.*)\*/#s', $doc, $comment ) === false){
            return $this->params;

        }
        $comment = trim ( $comment [1] );

        # 先解析块解析 并剔除
        $comment= $this->parseBlock($comment);

        # 获取所有的行数据,并从第一个字符中删除*
        if (preg_match_all ( '#^\s*\*(.*)#m', $comment, $lines ) === false){
            return $this->params;
        }

        $this->parseLines ( $lines [1] );
        return $this->params;
    }

    /**
     * 逐行解析注释
     * @param $lines
     */
    private function parseLines($lines) {

        foreach ( $lines as $line ) {
            $parsedLine = $this->parseLine ( $line ); // Parse the line

            if ($parsedLine === false && ! isset ( $this->params ['description'] )) {
                if (isset ( $desc )) {
                    $this->params ['description'] = implode ( PHP_EOL, $desc );
                }
                $desc = array ();
            # 如果
            } elseif ($parsedLine !== false) {
                $desc [] = $parsedLine;
            }
        }


        if(isset($desc)){
            $desc = implode ( ' ', $desc );
        }
        if (! empty ( $desc )){
            $this->params ['long_description'] = $desc;

        }
    }

    /**
     * 解析一行注释
     * @param $line
     * @return bool|string
     */
    private function parseLine($line) {
        # 去除空格 和空行
        $line = trim ( $line );
        if (empty ( $line )){
            return false; // Empty line
        }

        # 只解析加了@符号的注释
        if (strpos ( $line, '@' ) === 0) {
            if (strpos ( $line, ' ' ) > 0) {
                #参数名
                $param = substr ( $line, 1, strpos ( $line, ' ' ) - 1 );
                #参数值
                $value = substr ( $line, strlen ( $param ) + 2 );
            } else {
                $param = substr ( $line, 1 );
                $value = '';
            }

            $value=trim($value);

            # 将参数添加到params集合中
            if ($this->setParam ( $param, $value ))
                return false;
        }

        return $line;
    }

    /**
     * 块状解析
     * @param $comment 注释
     */
    public function parseBlock($comment){
        if($this->params_parse_block){
            foreach ($this->params_parse_block as $p){
               $zz='/'.$p.'(?:\{)(.*)(?:\})'.$p.'/is';
               if( preg_match($zz, $comment, $match)){
                     # 解决编辑器格式化每行前面加 * 问题
                     $result=implode("\n",array_map(function($n){
                         return trim(trim($n),'*');
                     },explode("\n",$match[1])));
                    $this->setParam($p,"{".$result."}");
               }
                $comment= preg_replace($zz,'',$comment);
            }
        }
        return $comment;
    }
    private function setParam($param, $value) {
        if(in_array($param,$this->params_array_keys)){
            $this->params[$param][]=$value;
        }else{
            $this->params[$param]=$value;
        }
        return true;
    }


}