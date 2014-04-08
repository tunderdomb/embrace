(function (){
  dust.register("dust", body_0);
  var blocks = {"title": body_6, "content": body_7};

  function body_0( chk, ctx ){
    ctx = ctx.shiftBlocks(blocks);
    return chk.section(ctx.get(["global"], false), ctx, {"block": body_1}, null).partial("layouts/extended", ctx, null);
  }

  function body_1( chk, ctx ){
    ctx = ctx.shiftBlocks(blocks);
    return chk.write(" hey ").reference(ctx.get([
      "ho"
    ], false), ctx, "h").write(" let's ").partial("nested/partial/go", ctx, null).write("\n").exists(ctx.get([
      "emptylist"
    ], false), ctx, {"else": body_2, "block": body_3}, null).section(ctx.get([
      "stringlist"
    ], false), ctx, {"block": body_5}, null);
  }

  function body_2( chk, ctx ){
    ctx = ctx.shiftBlocks(blocks);
    return chk.write("I hope nobody's taping this!");
  }

  function body_3( chk, ctx ){
    ctx = ctx.shiftBlocks(blocks);
    return chk.section(ctx.get(["emptylist"], false), ctx, {"block": body_4}, null);
  }

  function body_4( chk, ctx ){
    ctx = ctx.shiftBlocks(blocks);
    return chk.reference(ctx.getPath(true, []), ctx, "h");
  }

  function body_5( chk, ctx ){
    ctx = ctx.shiftBlocks(blocks);
    return chk.reference(ctx.getPath(true, []), ctx, "h", ["s"]).write("\n");
  }

  function body_6( chk, ctx ){
    ctx = ctx.shiftBlocks(blocks);
    return chk.write("Child Title");
  }

  function body_7( chk, ctx ){
    ctx = ctx.shiftBlocks(blocks);
    return chk.write("Child Content");
  }

  return body_0;
})();