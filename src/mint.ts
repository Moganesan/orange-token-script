import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import {
  getMint,
  TOKEN_2022_PROGRAM_ID,
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from "@solana/spl-token";
import dotenv from "dotenv";

dotenv.config();
(async () => {
  const connection = new Connection(
    "https://solana-devnet.g.alchemy.com/v2/UnmN7Go5D0TAlW1OWdINFP86drd0LoA7",
    "confirmed"
  );

  const PAYER_KEY = process.env.PAYER_KEY;
  const MINT_AUTHORITY_KEY = process.env.MINT_AUTHORITY_KEY;
  const MINT_KEY = process.env.MINT_KEY;
  const TOKEN_PUBLIC_KEY = process.env.TOKEN_PUBLIC_KEY;

  if (!PAYER_KEY || !MINT_KEY || !TOKEN_PUBLIC_KEY || !MINT_AUTHORITY_KEY) {
    console.log("Keys Not Found");
    return;
  }

  const payer = Keypair.fromSecretKey(
    new Uint8Array(Buffer.from(PAYER_KEY.toString(), "hex"))
  );
  const mintAuthority = Keypair.fromSecretKey(
    new Uint8Array(Buffer.from(MINT_AUTHORITY_KEY.toString(), "hex"))
  );

  const mint = Keypair.fromSecretKey(
    new Uint8Array(Buffer.from(MINT_KEY.toString(), "hex"))
  );

  // get token info
  const mintInfo = await getMint(
    connection,
    new PublicKey(TOKEN_PUBLIC_KEY),
    "confirmed",
    TOKEN_2022_PROGRAM_ID
  );

  // create or get token account
  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    new PublicKey(TOKEN_PUBLIC_KEY),
    payer.publicKey,
    false,
    "confirmed",
    undefined,
    TOKEN_2022_PROGRAM_ID
  );

  // mint 100 tokens into the account
  await mintTo(
    connection,
    payer,
    new PublicKey(TOKEN_PUBLIC_KEY),
    tokenAccount.address,
    mintAuthority,
    100000000000000000,
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID
  );
})();
